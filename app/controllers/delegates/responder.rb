# frozen_string_literal: true

module Delegates
  class Responder < ActionController::Responder
    def api_behavior
      raise MissingRenderer.new(format) unless has_renderer?
      display resource, options
    end
  end
end
