module V1
  class NotesController < ApiController
    include V1::Concerns::VirtualEntitySharing

    before_action :load_virtual_entity, except: [:index, :create]

    def index
      notes = paginate policy_scope(Note).eager_load(:tags).select("tags.id")
      respond_with notes, each_serializer: serializer
    end

    def update
      @ve.note.update!(data: note_params)
      respond_with @ve, status: :ok, serializer: serializer
    end

    def create
      note = Note.new(data: note_params)
      ve = VirtualEntity.new(user: current_user)
      authorize ve
      note.save!
      ve.entity = note
      ve.save
      respond_with ve, status: :created, serializer: serializer
    end

    def show
      respond_with @ve, serializer: serializer
    end

    def destroy
      @ve.note.destroy
      head :no_content
    end

    def share

    end

    private

    def load_virtual_entity
      @ve = VirtualEntity.find(params[:id])
      authorize @ve
    end

    def note_params
      params.require(:note).permit(:title, :body)
    end

    def serializer
      NoteSerializer
    end
  end
end
