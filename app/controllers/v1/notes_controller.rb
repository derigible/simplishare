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

    def create_params
      to_create = { data: request_params.select { |k, _| %w[title body].include? k } }
      to_create[:priority] = request_params[:priority]
      to_create
    end

    def serializer
      NoteSerializer
    end

    def request_params
      @request_params ||= params.require(:note).permit(:title, :body, :archived, :update_shared, :priority)
    end

    def update_params
      updates = {}
      data = request_params.select { |k, _| %w[title body].include? k }
      updates[:data] = @ve.entity.data.merge(data) unless data.empty?
      updates[:priority] = request_params[:priority] if request_params[:priority]
      updates
    end
  end
end
