# frozen_string_literal: true

require 'spec_helper'

describe User do
  describe 'relationships' do
    it do
      is_expected.to have_many(:access_tokens)
        .class_name('Oauth::AccessToken')
        .with_foreign_key(:resource_owner_id)
        .dependent(:delete_all)
    end
  end

  describe 'validations' do
  end
end
