# frozen_string_literal: true

module V1
  class TodosController < ApiController
    include V1::Concerns::VirtualEntityActions

    private

    def entity_model
      Todo
    end

    def data_params
      %w[title description]
    end

    def request_params
      @request_params ||= params
                          .require(:todo)
                          .permit(
                            :description,
                            :priority,
                            :archived,
                            :update_shared,
                            :title,
                            :todos
                          )
    end

    def serializer
      TodoSerializer
    end
  end
end
