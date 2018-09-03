module V1::Concerns
  class TodoDelegate
    def initialize(virtual_entity, params)
      @virtual_entity = virtual_entity
      @params = params
    end

    def destroy_record
      if VirtualEntityPolicy.new(current_user, virtual_entity).destroy_entity?
        virtual_entity.todo.destroy
      else
        virtual_entity.destroy
      end
    end

    def destroy_sub_todo
      todo_child = nth_child_from_end_of_parent_chain(virtual_entity.todo.todo, -2)
      raise ActiveRecord::RecordNotFound if todo_without_sub_todo(todo_child).nil? # means nothing happened and the parent_chain was wrong
      virtual_entity.todo.save!
    end

    def update_and_retrieve
      if params[:id] != 'new-sub-task' && params[:parent_chain].size == 1
        update_todo
      elsif params[:id] == 'new-sub-task'
        create_sub_todo
      else
        update_sub_todo
      end
    end

    private

    attr_reader :params, :virtual_entity

    def todo_without_sub_todo(todo)
      todo['todos'].reject! { |t| t['id'] == params[:parent_chain].last }
    end

    # the passed in value MUST be the AR record's todo
    def nth_child_from_end_of_parent_chain(todo, nth_child = -1)
      todo_child = todo
      todos = todo['todos']
      params[:parent_chain].slice(1..nth_child).each_with_index do |t_id, _|
        todo_child = todos.find { |t| t['id'] == t_id }
        # raise not found if todo_child is nil because the parentChain always ends on the desired todo,
        # and so if nil means the id does not exist
        raise ActiveRecord::RecordNotFound if todo_child.nil?
        # only change the todos if not at the end of the todos
        todos = todo_child['todos']
      end
      todo_child
    end

    def create_sub_todo
      todo_child = nth_child_from_end_of_parent_chain(virtual_entity.todo.todo)
      todo_child['todos'].push({
        id: SecureRandom.uuid,
        created_at: Time.zone.now,
        updated_at: Time.zone.now
      }.merge!(todo_update_child_params))
    end

    def update_sub_todo
      todo_child = nth_child_from_end_of_parent_chain(virtual_entity.todo.todo)

      raise ActiveRecord::RecordNotFound unless todo_child['id'] == params[:id]

      todo_child['updated_at'] = Time.zone.now
      todo_child.merge! todo_update_child_params
    end

    def update_todo
      virtual_entity.todo.data.merge! todo_update_params
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
  end
end
