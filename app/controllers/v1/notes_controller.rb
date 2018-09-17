# frozen_string_literal: true

module V1
  class NotesController < ApiController
    include V1::Concerns::VirtualEntitySharing

    before_action :load_virtual_entity, except: %i[index create]

    def index
      notes = paginate policy_scope(Note).eager_load(:virtual_tags).select("virtual_tags.id")
      respond_with notes, each_serializer: serializer
    end

    def update
      skip_authorization
      if updating_note?
        authorize(@ve)
        @ve.note.update!(update_note_params)
      end
      update_archived_if_requested
      SharingMailer.send_update(current_user, @ve.entity)
      respond_with @ve, status: :ok, serializer: serializer
    end

    def create
      note = Note.new(create_note_params)
      ve = VirtualEntity.new(user: current_user)
      authorize ve
      note.save!
      ve.entity = note
      ve.save
      respond_with ve, status: :created, serializer: serializer
    end

    def show
      authorize(@ve)
      respond_with @ve, serializer: serializer
    end

    def destroy
      authorize(@ve)
      @ve.note.destroy
      head :no_content
    end

    private

    def load_virtual_entity
      @ve = VirtualEntity.find(params[:id])
    end

    def create_note_params
      to_create = { data: request_params.select { |k, _| %w[title body].include? k } }
      to_create[:priority] = request_params[:priority]
      to_create
    end

    def update_note_params
      updates = {}
      data = request_params.select { |k, _| %w[title body].include? k }
      updates[:data] = data unless data.empty?
      updates[:priority] = request_params[:priority] if request_params[:priority]
      updates
    end

    def request_params
      @request_params ||= params.require(:note).permit(:title, :body, :archived, :update_shared, :priority)
    end

    def update_archived_if_requested
      return if request_params[:archived].nil?
      policy = VirtualEntityPolicy.new(current_user, @ve)
      update_archived(policy, request_params[:archived], request_params[:update_shared])
    end

    def update_archived(policy, new_archived, update_shared)
      if policy.archive_entity? && update_shared
        @ve.entity.update!(archived: new_archived)
      elsif policy.archive?
        @ve.update!(archived: new_archived)
      else
        raise Pundit::NotAuthorizedError, query: :update?, record: @ve, policy: policy
      end
    end

    def updating_note?
      %i[title body priority].any? do |param|
        request_params.include? param
      end
    end

    def serializer
      NoteSerializer
    end
  end
end
