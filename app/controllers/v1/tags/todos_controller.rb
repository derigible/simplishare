# frozen_string_literal: true

module V1
  module Tags
    class TodosController < ApiController
      before_action :load_todo
      before_action :load_tags_create, only: [:create]
      before_action :load_tags_destroy, only: [:destroy]

      def create
        @todo.virtual_tags << @vtags
        respond_with @todo.reload, serializer: TodoSerializer
      end

      def destroy
        @vtags.each do |tag|
          @todo.virtual_tags.destroy(tag)
        end
        respond_with @todo.reload, serializer: TodoSerializer
      end

      private

      def load_todo
        @todo = VirtualEntity.find(params[:todo_id])
        authorize @todo
      end

      def load_tags_create
        tag_ids = params.fetch(:tag_ids, []).reject do |tag_id|
          @todo.virtual_tag_ids.include?(tag_id)
        end
        load_tags(tag_ids)
      end

      def load_tags_destroy
        load_tags(params.fetch(:tag_ids, []))
      end

      def load_tags(tag_ids)
        @vtags = VirtualTag.where(id: tag_ids)
        @vtags.each do |tag|
          authorize tag
        end
      end
    end
  end
end
