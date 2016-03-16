require 'spec_helper'

module V1
  describe V1::EventsAccountSerializer do

    describe 'serializer structure' do
      subject { EventsAccountSerializer.new(create(:events_account)).attributes }

      it { is_expected.to have_key(:id) }
    end
  end
end
