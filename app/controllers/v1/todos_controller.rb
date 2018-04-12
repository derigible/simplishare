module V1
  class TodosController < ApiController
    before_action :load_todo, only: %i[show destroy update]

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
      if params[:parent_chain].empty?
        @todo.todo.merge! **todo_update_params
      else
        todos = @todo.todo.todos
        todo_child = nil
        params[:parent_chain].slice(1, -1).each_with_index do |t_id, i|
          todo_child = todos.find { |t| t.id == t_id }
          # raise not found if todo_child is nil because the parentChain always ends on the desired todo,
          # and so if nil means the id does not exist
          raise ActiveRecord::RecordNotFound if todo_child.nil?
          # only change the todos if not at the end of the todos
          todos = todo_child.todos
        end
        if todo_child[:id] == params[:id]
          todo_child.merge! updated_at: Time.zone.now, **todo_update_child_params
        elsif params[:id] == 'new-sub-task'
          todos.push({
            id: SecureRandom.uuid,
            created_at: Time.zone.now,
            updated_at: Time.zone.now,
            **todo_update_child_params
          })
        else
          raise ActiveRecord::RecordNotFound
        end
        @todo.save
      end

      respond_with @todo, status: :ok, serializer: Todo
    end

    def create
      todo = Todo.new(user: current_resource_owner, todo: todo_create_params)
      authorize todo
      todo.save
      respond_with todo, status: :created, serializer: Todo
    end

    def show
      respond_with @todo, serializer: Todo
    end

    def destroy
      @todo.destroy
      head :no_content
    end

    private

    def load_todo
      @todo = Todo.find params[:id]
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
