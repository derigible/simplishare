require 'spec_helper'

module V1
  describe V1::AccountSerializer do

    describe 'serializer structure' do
      let(:to_serialize) { create(:account) }

      it { is_expected.to have_key(:id) }
      it { is_expected.to have_key(:name) }
    end
  end
end
