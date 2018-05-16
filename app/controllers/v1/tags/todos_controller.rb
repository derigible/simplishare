module V1
  module Tags
    class TodosController < ApiController
      before_action :load_todo, :load_tag

      def update
        @todo.tags << @tag
        head :success
      end

      private

      def load_todo
        @todo = Todo.find(params[:id])
        authorize @todo
      end

      def load_tag
        @tag = Tag.find(params[:tag_id])
        authorize @tag
      end
    end
  end
end
