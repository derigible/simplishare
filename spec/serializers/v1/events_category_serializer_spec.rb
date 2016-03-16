require 'spec_helper'

module V1
  describe V1::EventsCategorySerializer do

    describe 'serializer structure' do
      subject { EventsCategorySerializer.new(create(:events_category)).attributes }

      it { is_expected.to have_key(:id) }
    end
  end
end
