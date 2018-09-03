# frozen_string_literal: true

require 'spec_helper'

describe Account do
  describe 'associations' do
    it do
      is_expected.to have_many(:events_accounts).dependent(:delete_all)
        .autosave(true).inverse_of(:account)
    end
    it { is_expected.to have_many(:events) }
  end
end
