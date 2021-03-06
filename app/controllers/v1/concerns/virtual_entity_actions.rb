# frozen_string_literal: true

module V1
  module Concerns
    module VirtualEntityActions
      extend ActiveSupport::Concern

      include CreateAction
      include DestroyAction
      include IndexAction
      include ShowAction
      include UpdateAction
      include ArchiveActions
      include SnoozeActions
      include PreferenceActions
      include ShareActions
      include TagActions

      private

      def entity_model
        raise 'Must define on controller'
      end

      def virtual_model
        VirtualEntity
      end

      def virtual_policy
        VirtualEntityPolicy
      end

      def ve
        @ve = virtual_model.where(id: params[:id]).eager_load(virtual_tags: :tag).take!
      end

      # params

      def data_params
        raise 'Must define on controller'
      end

      def request_params
        raise 'Must define on controller'
      end
    end
  end
end
