# frozen_string_literal: true

require 'spec_helper'

describe Oauth::AccessToken do
  describe 'relationships' do
    it { is_expected.to belong_to(:resource_owner).class_name('User') }
  end

  describe '.by_token' do
    let(:access_token) do
      create(:'oauth/access_token')
    end
    let(:user) { access_token.resource_owner }

    it 'returns access_token from correct shard' do
      expect(Oauth::AccessToken.by_token(access_token.token)).to eq access_token
    end
  end
end
