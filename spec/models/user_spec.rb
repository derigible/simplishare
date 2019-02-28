# frozen_string_literal: true

require 'spec_helper'

describe User do
  describe 'relationships' do
    it do
      is_expected.to have_many(:virtual_entities).inverse_of(:user).dependent(:destroy)
    end
    it do
      is_expected.to have_many(:entities).through(:virtual_entities)
    end
    it do
      is_expected.to have_many(:todos).through(:virtual_entities)
    end
    it do
      is_expected.to have_many(:notes).through(:virtual_entities)
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of :email }
    it { is_expected.to validate_presence_of :username }
  end
end
