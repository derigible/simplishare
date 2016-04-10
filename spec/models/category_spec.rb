require 'spec_helper'

describe Category do
  describe 'associations' do
    it do
      is_expected.to have_many(:events_categories).dependent(:delete_all)
        .autosave(true).inverse_of(:category)
    end
    it { is_expected.to have_many(:events).through(:events_categories) }
  end
end
