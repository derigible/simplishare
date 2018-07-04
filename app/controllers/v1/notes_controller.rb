module V1
  class NotesController < ApiController
    before_action :load_virtual_entity, except: [:index, :create]

    def index
      notes = paginate policy_scope(Note).eager_load(:tags).select("tags.id")
      respond_with notes, each_serializer: NoteSerializer
    end

    def update
      @ve.note.update!(data: note_params)
      respond_with @ve, status: :ok, serializer: NoteSerializer
    end

    def create
      note = Note.new(data: note_params)
      ve = VirtualEntity.new(user: current_user)
      authorize ve
      note.save!
      ve.entity = note
      ve.save
      respond_with ve, status: :created, serializer: NoteSerializer
    end

    def show
      respond_with @ve, serializer: NoteSerializer
    end

    def destroy
      @ve.note.destroy
      head :no_content
    end

    private

    def load_virtual_entity
      @ve = VirtualEntity.find(params[:id])
      authorize @ve
    end

    def note_params
      params.require(:note).permit(:title, :body)
    end
  end
end
