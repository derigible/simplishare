# frozen_string_literal: true

require 'spec_helper'

describe EventsAccount do
  describe 'associations' do
    it { is_expected.to belong_to(:account) }
    it { is_expected.to belong_to(:event) }
  end
end
