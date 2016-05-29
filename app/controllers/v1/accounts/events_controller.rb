module V1
  module Accounts
    class EventsController < ApiController
      def index
        @events = paginate Account.find(params[:account_id]).events
        respond_with @events, each_serializer: EventSerializer
      end
    end
  end
end
