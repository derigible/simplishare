module V1
  module Tags
    class TodosController < ApiController
      before_action :load_todo
      before_action :load_tags_create, only: [:create]
      before_action :load_tags_destroy, only: [:destroy]

      def create
        @todo.tags << @tags
        respond_with @todo.reload, serializer: TodoSerializer
      end

      def destroy
        @tags.each do |tag|
          @todo.tags.destroy(tag)
        end
        respond_with @todo.reload, serializer: TodoSerializer
      end

      private

      def load_todo
        @todo = Todo.find(params[:todo_id])
        authorize @todo
      end

      def load_tags_create
        tag_ids = params.fetch(:tag_ids, []).reject do |tag_id|
          @todo.tag_ids.include?(tag_id)
        end
        load_tags(tag_ids)
      end

      def load_tags_destroy
        load_tags(params.fetch(:tag_ids, []))
      end

      def load_tags(tag_ids)
        @tags = Tag.where(id: tag_ids)
        @tags.each do |tag|
          authorize tag
        end
      end
    end
  end
end
