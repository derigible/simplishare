require 'spec_helper'

describe Doorkeeper::JWT do
  describe 'configuration.payload' do
    let(:user) { create(:user) }
    before do
      @options = {
        resource_owner_id: user.id
      }
    end
    subject(:payload) do
      Doorkeeper::JWT.configuration.token_payload.call(@options)
    end

    it 'includes user information' do
      [:id, :email].each do |attr|
        expect(payload[:user][attr]).to eq user.send(attr)
      end
    end

    it 'includes jwt-specific keys' do
      [:exp, :iat, :jti, :nbf].each do |k|
        expect(payload.key?(k)).to be_truthy
      end
    end
  end
end
