# frozen_string_literal: true

module V1
  module Concerns
    module CreateAction
      extend ActiveSupport::Concern

      def create
        entity = entity_model.new(create_params)
        new_ve = virtual_model.new(user: current_user)
        authorize new_ve
        entity.save!
        new_ve.entity = entity
        new_ve.save
        respond_with new_ve, status: :created, serializer: serializer
      end

      private

      def data_params
        raise 'Must define on controller'
      end

      def request_params
        raise 'Must define on controller'
      end

      def create_params
        to_create = { data: request_params.select { |k, _| data_params.include? k } }
        to_create[:priority] = request_params[:priority]
        to_create
      end
    end
  end
end
