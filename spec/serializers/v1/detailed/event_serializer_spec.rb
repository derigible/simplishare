require 'spec_helper'

module V1
  describe V1::Detailed::EventSerializer do

    describe 'serializer structure' do
      let(:to_serialize) { create(:event) }

      it { is_expected.to have_key(:id) }
      it { is_expected.to have_key(:description) }
      it { is_expected.to have_key(:amount) }
      it { is_expected.to have_key(:is_debit) }
      it { is_expected.to have_key(:notes) }
      it { is_expected.to have_key(:accounts) }
      it { is_expected.to have_key(:categories) }

      # TODO: Add back in the dates

      # it { is_expected.to have_key(:created_at) }
      # it { is_expected.to have_key(:updated_at) }
    end
  end
end
