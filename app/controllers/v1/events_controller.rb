module V1
  class EventsController < ApiController
    def index
      @events = Event.all
      respond_with @events, each_serializer: EventSerializer
    end

    def update
      @event = Event.find(params[:id])
      @event.update(event_params)
      respond_with @event, status: :ok, serializer: EventSerializer
    end

    def create
      @event = Event.new(event_params)
      @event.save
      respond_with @event, status: :created, serializer: EventSerializer
    end

    def show
      @event = Event.find(params[:id])
      respond_with @event, serializer: EventSerializer
    end

    def destroy
      @event = Event.find(params[:id])
      @event.destroy
      head :no_content
    end

    # upload a csv of events (currently only support mint transaction csvs)
    def bulk_create
      @events = Event.import_csv(upload.read)
      respond_with @events, each_serializer: EventSerializer
    rescue Event::MissingCsvKeysError => e
      respond_with({ error: e }, status: :bad_request)
    end

    private

    def event_params
      params.require(:event).permit(:description, :amount, :is_debit, :notes, :dates)
    end

    def upload
      params.require(:upload)
    end
  end
end
