module V1
  class EventsController < ApiController
    before_action :load_event, except: [:index]

    def index
      @events = DateFilterService.new(params, policy_scope(default_scope)).filter
      respond_with paginate @events, each_serializer: V1::Detailed::EventSerializer
    end

    def update
      @event.update(event_params)
      respond_with @event, serializer: V1::Detailed::EventSerializer
    end

    def create
      @event = Event.new(event_params)
      authorize @event
      @event.save
      respond_with @event, status: :created, serializer: V1::Detailed::EventSerializer
    end

    def show
      respond_with @event, serializer: V1::Detailed::EventSerializer
    end

    def destroy
      @event.destroy
      head :no_content
    end

    # upload a csv of events (currently only supports mint transaction csvs)
    def bulk_create
      authorize Event
      @events = EventImportService.import_csv(current_user, upload.read)
      head status: :created
    rescue EventImportService::MissingCsvKeysError => e
      respond_with({ error: e }, status: :bad_request)
    end

    private

    def load_event
      @event = Event.find params[:id]
      authorize @event
    end

    def event_params
      params.require(:event).permit(:description, :amount, :is_debit, :notes, :dates)
    end

    def upload
      params.require(:upload)
    end

    def default_scope
      Event.all.includes(:accounts, :categories).order(date: :desc)
    end
  end
end
