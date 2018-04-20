module V1
  class EventsController < ApiController
    before_action :load_event, except: %i[index bulk_create]

    def index
      @events = paginate DateFilterService.new(params, policy_scope(default_scope)).filter
      respond_with @events, each_serializer: V1::Detailed::EventSerializer
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
      current_resource_owner.csv_uploads.attach(upload)
      current_resource_owner.save
      if current_resource_owner.valid?
        user.send_later(:upload_events)
        head :created
      else
        respond_with({ error: e }, status: :bad_request)
      end
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
      params.require(:csv_uploads)
    end

    def default_scope
      Event.eager_load(:events_accounts, :events_categories)
    end
  end
end
