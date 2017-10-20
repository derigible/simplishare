require 'spec_helper'

module V1
  describe V1::EventsCategorySerializer do

    describe 'serializer structure' do
      let(:to_serialize) { create(:events_category) }

      it { is_expected.to have_key(:id) }
    end
  end
end
