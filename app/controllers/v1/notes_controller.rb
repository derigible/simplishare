module V1
  class NotesController < ApiController
    before_action :load_note, except: [:index, :create]

    def index
      notes = paginate policy_scope(Note)
      respond_with notes, each_serializer: NoteSerializer
    end

    def update
      @note.update(data: note_params)
      respond_with @note, status: :ok, serializer: NoteSerializer
    end

    def create
      note = Note.new(data: note_params)
      note.user = current_resource_owner
      authorize note
      note.save
      respond_with note, status: :created, serializer: NoteSerializer
    end

    def show
      respond_with @note, serializer: NoteSerializer
    end

    def destroy
      @note.destroy
      head :no_content
    end

    private

    def load_note
      @note = Note.find(params[:id])
      authorize @note
    end

    def note_params
      params.require(:note).permit(:title, :body)
    end
  end
end
