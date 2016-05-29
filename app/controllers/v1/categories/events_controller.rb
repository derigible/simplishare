module V1
  module Categories
    class EventsController < ApiController
      def index
        @events = Category.find(params[:category_id]).events
        respond_with @events, each_serializer: EventSerializer
      end
    end
  end
end
