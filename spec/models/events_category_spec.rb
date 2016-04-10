require 'spec_helper'

describe EventsCategory do
  describe 'associations' do
    it { is_expected.to belong_to(:category) }
    it { is_expected.to belong_to(:event) }
  end
end
