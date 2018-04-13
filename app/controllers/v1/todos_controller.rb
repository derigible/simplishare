module V1
  class TodosController < ApiController
    def index
      todos = paginate policy_scope(Todo)
      respond_with todos, each_serializer: TodoSerializer
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
      todo = if params[:id] != 'new-sub-task' && params[:parent_chain].size == 1
        update_task
      elsif params[:id] == 'new-sub-task'
        create_sub_task
      else
        update_sub_task
      end
      todo.save

      respond_with todo, status: :ok, serializer: TodoSerializer
    end

    def create
      todo = Todo.new(user: current_resource_owner, todo: {todos: []}.merge!(todo_create_params))
      authorize todo
      todo.save
      respond_with todo, status: :created, serializer: TodoSerializer
    end

    def show
      todo = Todo.find params[:id]
      authorize(todo)
      respond_with todo, serializer: Todo
    end

    def destroy
      todo = Todo.find params[:id]
      authorize(todo)
      todo.destroy
      head :no_content
    end

    private

    def find_db_record_from_parent_chain
      todo = Todo.find params[:parent_chain].first
      authorize(todo)
      todo
    end

    # the passed in value MUST be the AR record's todo
    def find_last_in_parent_chain(todo)
      todo_child = todo
      todos = todo['todos']
      params[:parent_chain].slice(1..-1).each_with_index do |t_id, i|
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
      todo = find_db_record_from_parent_chain
      todo_child = find_last_in_parent_chain(todo.todo)
      todo_child['todos'].push({
        id: SecureRandom.uuid,
        created_at: Time.zone.now,
        updated_at: Time.zone.now
      }.merge!(todo_update_child_params))
      todo
    end

    def update_sub_task
      todo = find_db_record_from_parent_chain
      todo_child = find_last_in_parent_chain(todo.todo)
      if todo_child['id'] == params[:id]
        todo_child.merge!(updated_at: Time.zone.now).merge!(todo_update_child_params)
      else
        raise ActiveRecord::RecordNotFound
      end
      todo
    end

    def update_task
      todo = Todo.find params[:id]
      authorize(todo)
      todo.todo.merge! todo_update_params
      todo
    end

    def todo_create_params
      params
        .require(:todo)
        .permit(:description, :priority, :todos, :title)
    end

    def todo_update_params
      params
        .require(:todo)
        .permit(:description, :priority, :title)
    end

    def todo_update_child_params
      params
        .require(:todo)
        .permit(:description, :priority, :title, parent_chain: [])
    end
  end
end
