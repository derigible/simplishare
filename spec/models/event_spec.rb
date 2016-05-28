require 'spec_helper'

describe Event do
  describe 'associations' do
    it do
      is_expected.to have_many(:events_accounts).dependent(:delete_all)
        .autosave(true).inverse_of(:event)
    end

    it do
      is_expected.to have_many(:events_categories).dependent(:delete_all)
        .autosave(true).inverse_of(:event)
    end

    it { is_expected.to have_many(:categories).through(:events_categories) }
    it { is_expected.to have_many(:accounts).through(:events_accounts) }
  end
end
