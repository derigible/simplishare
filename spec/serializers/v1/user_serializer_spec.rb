# frozen_string_literal: true

require 'spec_helper'

describe V1::UserSerializer do
  describe 'serializer structure' do
    let(:to_serialize) { create(:user) }

    it { is_expected.to have_key(:id) }
    it { is_expected.to have_key(:email) }
  end
end
