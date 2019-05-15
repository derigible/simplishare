# frozen_string_literal: true

module V1
  class NotesController < ApiController
    include V1::Concerns::VirtualEntitySharing
    include V1::Concerns::VirtualEntityPreferences
    include V1::Concerns::VirtualEntityActions

    private

    def load_virtual_entity
      @ve = VirtualEntity.find(params[:id])
    end

    def entity_model
      Note
    end

    def data_params
      %w[title body]
    end

    def serializer
      NoteSerializer
    end

    def request_params
      @request_params ||= params
                          .require(:note)
                          .permit(
                            :title,
                            :body,
                            :archived,
                            :update_shared,
                            :priority
                          )
    end
  end
end
