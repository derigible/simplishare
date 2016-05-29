module V1
  class EventsController < ApiController
    def index
      @events = Event.all.includes(:accounts, :categories)
      respond_with @events, each_serializer: V1::Detailed::EventSerializer
    end

    def update
      @event = Event.find(params[:id])
      @event.update(event_params)
      respond_with @event, status: :ok, serializer: V1::Detailed::EventSerializer
    end

    def create
      @event = Event.new(event_params)
      @event.save
      respond_with @event, status: :created, serializer: V1::Detailed::EventSerializer
    end

    def show
      @event = Event.find(params[:id])
      respond_with @event, serializer: V1::Detailed::EventSerializer
    end

    def destroy
      @event = Event.find(params[:id])
      @event.destroy
      head :no_content
    end

    # upload a csv of events (currently only supports mint transaction csvs)
    def bulk_create
      @events = EventImportService.import_csv(upload.read)
      head status: :created
    rescue EventImportService::MissingCsvKeysError => e
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
