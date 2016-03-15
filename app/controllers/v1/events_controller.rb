module V1
  class EventsController < ApiController
    def index
      @events = Event.all
      respond_with @events, each_serializer: V1::EventSerializer
    end

    def update
      @event = Event.find(params[:id])
      @event.update(event_params)
      respond_with @event, status: :ok, serializer: V1::EventSerializer
    end

    def create
      @event = Event.new(event_params)
      @event.save
      respond_with @event, status: :created, serializer: V1::EventSerializer
    end

    def show
      @event = Event.find(params[:id])
      respond_with @event, serializer: V1::EventSerializer
    end

    def destroy
      @event = Event.find(params[:id])
      @event.destroy
      head :no_content
    end

    private

    def event_params
      params.require(:event).permit(:description, :amount, :is_debit, :notes, :dates)
    end
  end
end
