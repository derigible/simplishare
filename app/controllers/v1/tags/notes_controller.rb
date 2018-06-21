module V1
  module Tags
    class NotesController < ApiController
      before_action :load_note
      before_action :load_tags_create, only: [:create]
      before_action :load_tags_destroy, only: [:destroy]

      def create
        @note.tags << @tags
        respond_with @note.reload, serializer: NoteSerializer
      end

      def destroy
        @tags.each do |tag|
          @note.tags.destroy(tag)
        end
        respond_with @note.reload, serializer: NoteSerializer
      end

      private

      def load_note
        @note = Note.find(params[:note_id])
        authorize @note
      end

      def load_tags_create
        tag_ids = params.fetch(:tag_ids, []).reject do |tag_id|
          @note.tag_ids.include?(tag_id)
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
