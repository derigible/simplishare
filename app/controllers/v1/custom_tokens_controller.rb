module V1
  class CustomTokensController < Doorkeeper::TokensController
    def create
      response = authorize_response
      headers.merge! response.headers
      self.response_body = response.body.to_json
      self.status        = response.status
    end
  end
end
