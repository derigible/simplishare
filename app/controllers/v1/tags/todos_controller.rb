module V1
  module Tags
    class TodosController < ApiController
      before_action :load_todo, :load_tags

      def create
        @todo.tags << @tags
        respond_with @todo, serializer: TodoSerializer
      end

      private

      def load_todo
        @todo = Todo.find(params[:todo_id])
        authorize @todo
      end

      def load_tags
        @tags = Tag.where(id: params[:tag_ids])
        @tags.each do |tag|
          authorize tag
        end
      end
    end
  end
end
