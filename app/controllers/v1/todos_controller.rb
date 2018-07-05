module V1
  class TodosController < ApiController
    include V1::Concerns::VirtualEntitySharing

    def index
      todos = paginate TodosFilter.new(params, policy_scope(Todo).eager_load(:tags).select("tags.id")).filter
      respond_with todos, each_serializer: serializer
    end

    #
    # To update a top-level todo, just pass the updates as needed
    #   - The id in the path will point to the record in the database
    # To add a new sub-level todo, pass in the parent chain and the new sub-level todo
    #   - The id in the path should be new-sub-task
    #   - If the parentChain is not valid, throws a RecordNotFound
    #   - If valid, will create a new subtask under the last todo in the parentChain
    # To update an exisiting sub-level todo, pass in the parentChain and the id with the updates
    #   - The id in the path should be the id of the todo to update
    #   - If the parentChain is not valid, throws a RecordNotFound
    # If id in the path does not equal one of those three, RecordNotFound is thrown
    def update
      ve = if params[:id] != 'new-sub-task' && params[:parent_chain].size == 1
        update_task
      elsif params[:id] == 'new-sub-task'
        create_sub_task
      else
        update_sub_task
      end
      ve.todo.save!
      respond_with ve, status: :ok, serializer: serializer
    end

    def create
      todo = Todo.new(data: todo_create_params)
      ve = VirtualEntity.new(user: current_user)
      authorize todo
      todo.save!
      ve.entity = todo
      ve.save
      respond_with todo, status: :created, serializer: serializer
    end

    def show
      ve = VirtualEntity.find params[:id]
      authorize(ve)
      respond_with ve, serializer: Todo
    end

    def destroy
      ve = VirtualEntity.find_by(id: params[:id])
      if ve.present?
        authorize(ve)
        ve.todo.destroy
      else
        ve = find_db_record_from_parent_chain
        authorize(ve)
        todo_child = nth_child_from_end_of_parent_chain(ve.todo.todo, -2)
        deleted = todo_child['todos'].reject! { |t| t['id'] == params[:parent_chain].last }
        raise ActiveRecord::RecordNotFound if deleted.nil? # means nothing happened and the parent_chain was wrong
        ve.todo.save!
      end
      head :no_content
    end

    private

    def find_db_record_from_parent_chain
      ve = VirtualEntity.find params[:parent_chain].first
      authorize(ve)
      ve
    end

    # the passed in value MUST be the AR record's todo
    def nth_child_from_end_of_parent_chain(todo, n = -1)
      todo_child = todo
      todos = todo['todos']
      params[:parent_chain].slice(1..n).each_with_index do |t_id, _|
        todo_child = todos.find { |t| t['id'] == t_id }
        # raise not found if todo_child is nil because the parentChain always ends on the desired todo,
        # and so if nil means the id does not exist
        raise ActiveRecord::RecordNotFound if todo_child.nil?
        # only change the todos if not at the end of the todos
        todos = todo_child['todos']
      end
      todo_child
    end

    def create_sub_task
      ve = find_db_record_from_parent_chain
      todo_child = nth_child_from_end_of_parent_chain(ve.todo.todo)
      todo_child['todos'].push({
        id: SecureRandom.uuid,
        created_at: Time.zone.now,
        updated_at: Time.zone.now
      }.merge!(todo_update_child_params))
      ve
    end

    def update_sub_task
      ve = find_db_record_from_parent_chain
      todo_child = nth_child_from_end_of_parent_chain(ve.todo.todo)

      raise ActiveRecord::RecordNotFound unless todo_child['id'] == params[:id]

      todo_child['updated_at'] = Time.zone.now
      todo_child.merge! todo_update_child_params
      ve
    end

    def update_task
      ve = VirtualEntity.find params[:id]
      authorize(ve)
      ve.todo.data.merge! todo_update_params
      ve
    end

    def todo_create_params
      params
        .require(:todo)
        .permit(:description, :priority, :todos, :title)
    end

    def todo_update_params
      params
        .require(:todo)
        .permit(:description, :priority, :completed, :title)
    end

    def todo_update_child_params
      params
        .require(:todo)
        .permit(:description, :priority, :completed, :title, parent_chain: [])
    end

    def serializer
      TodoSerializer
    end
  end
end
