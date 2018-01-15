module V1
  class TodosController < ApiController
    before_action :load_todo, except: [:index]

    def index
      @todos = paginate policy_scope(Todo)
      respond_with @todos, each_serializer: TodoSerializer
    end

    def update
      @todo.update(todo_params)
      respond_with @todo, status: :ok, serializer: Todo
    end

    def create
      @todo = Todo.new(todo_params)
      authorize @todo
      @todo.save
      respond_with @todo, status: :created, serializer: Todo
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
      @todo = Todo.find(params[:id])
    end

    def todo_params
      params
        .require(:todos)
        .permit(:id, :description, :priority, :todos, :title, :parent_chain).tap do |whitelisted|
          whitelisted[:todos] = params[:todos]
        end
    end
  end
end
