# frozen_string_literal: true

module V1
  module Categories
    class EventsController < ApiController
      def index
        @events = paginate DateFilter.new(params, policy_scope(default_scope)).filter
        respond_with @events, each_serializer: V1::Detailed::EventSerializer
      end

      private

      def default_scope
        Category.find(params[:category_id]).events
      end
    end
  end
end
