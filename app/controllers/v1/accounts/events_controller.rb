# frozen_string_literal: true

module V1
  module Accounts
    class EventsController < ApiController
      def index
        @events = ApiPagination.paginate policy_scope(default_scope)
        respond_with @events, each_serializer: V1::Detailed::EventSerializer
      end

      private

      def default_scope
        Account.find(params[:account_id]).events
      end
    end
  end
end
