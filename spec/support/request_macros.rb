# frozen_string_literal: true

module RequestMacros
  extend ActiveSupport::Concern

  included do
    let(:token) do
      double acceptable?: true, scopes: [:api]
    end
  end
end
