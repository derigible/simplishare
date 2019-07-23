# frozen_string_literal: true

module V1
  module Concerns
    module TagActions
      extend ActiveSupport::Concern

      def tag
        ve.virtual_tags << vtags(create_tag_ids)
        respond_with ve.reload, serializer: serializer
      end

      def untag
        authorize(ve)
        VirtualTag.where(id: vtags(params.fetch(:tag_ids, []))).destroy_all
        respond_with ve.reload, serializer: serializer
      end

      private

      def create_tag_ids
        params.fetch(:tag_ids, []).reject do |tag_id|
          ve.virtual_tag_ids.include?(tag_id)
        end
      end

      def load_tags_destroy
        vtags(params.fetch(:tag_ids, []))
      end

      def vtags(tag_ids)
        VirtualTag.where(id: tag_ids).map do |tag|
          authorize tag
          tag.id
        end
      end
    end
  end
end
