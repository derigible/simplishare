# frozen_string_literal: true

module V1
  module Concerns
    module UpdateAction
      extend ActiveSupport::Concern

      def update
        perform_update
        send_update_email
        respond_with ve, serializer: serializer
      end

      private

      def perform_update
        authorize(ve)
        ve.entity.update!(update_params)
      end

      def send_update_email
        SharingMailer.send_update(current_user, ve.entity)
      end

      # params

      def data_params
        raise 'Must define on controller'
      end

      def request_params
        raise 'Must define on controller'
      end

      def update_params
        updates = {}
        data = request_params.select { |k, _| data_params.include? k }
        updates[:data] = ve.entity.data.merge(data) unless data.empty?
        updates[:priority] = request_params[:priority] if request_params[:priority]
        updates
      end
    end
  end
end
