# frozen_string_literal: true

module V1::Concerns
  class TodoDelegate
    def initialize(virtual_entity, user, params)
      @virtual_entity = virtual_entity
      @params = params
      @user = user
    end

    def destroy_record
      if policy.destroy_entity?
        virtual_entity.todo.destroy
      elsif policy.destroy?
        virtual_entity.destroy
      else
        raise Pundit::NotAuthorizedError, query: :destroy?, record: virtual_entity, policy: policy
      end
    end

    def destroy_sub_todo
      todo_child = nth_child_from_end_of_parent_chain(virtual_entity.todo.todo, -2)
      # means nothing happened and the parent_chain was wrong
      raise ActiveRecord::RecordNotFound if todo_without_sub_todo(todo_child).nil?
      virtual_entity.todo.save!
    end

    def update
      if not_subtask?
        update_todo
      elsif params[:id] == 'new-sub-task'
        create_sub_todo
      else
        update_sub_todo
      end
      virtual_entity.todo.save!
    end

    def change_archive_if_requested
      return unless not_subtask?
      return if todo_update_entity_params[:completed].nil?
      update_archived(todo_update_entity_params[:completed], todo_update_todo_params[:update_shared])
    end

    private

    attr_reader :params, :virtual_entity, :user

    def not_subtask?
      params[:id] != 'new-sub-task' && (params[:parent_chain].nil? || params[:parent_chain].size == 1)
    end

    def todo_without_sub_todo(todo)
      todo['todos'].reject! { |t| t['id'] == params[:parent_chain]&.last }
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
      todo_child['todos'].push(todo_update_child_params)
    end

    def update_sub_todo
      todo_child = nth_child_from_end_of_parent_chain(virtual_entity.todo.todo)

      raise ActiveRecord::RecordNotFound unless todo_child['id'] == params[:id]

      todo_child['updated_at'] = Time.zone.now
      todo_child.merge! todo_update_child_params
    end

    def update_todo
      priority = todo_update_entity_params[:priority]
      virtual_entity.todo.data.merge! todo_update_todo_params
      virtual_entity.todo.priority = priority if priority
    end

    def update_archived(new_completed, update_shared)
      if policy.archive_entity? && update_shared
        virtual_entity.todo.update!(archived: new_completed)
      elsif policy.archive?
        virtual_entity.update!(archived: new_completed)
      else
        raise Pundit::NotAuthorizedError, query: :update?, record: @ve, policy: policy
      end
    end

    def todo_update_todo_params
      params
        .require(:todo)
        .permit(:description, :title)
    end

    def todo_update_entity_params
      params
        .require(:todo)
        .permit(:priority, :completed, :update_shared)
    end

    def todo_update_child_params
      params
        .require(:todo)
        .permit(:description, :priority, :completed, :title, parent_chain: [])
    end

    def policy
      VirtualEntityPolicy.new(user, virtual_entity)
    end
  end
end
