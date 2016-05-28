require 'spec_helper'

module V1
  describe V1::Detailed::AccountSerializer do

    describe 'serializer structure' do
      subject { V1::Detailed::AccountSerializer.new(create(:account)).attributes }

      it { is_expected.to have_key(:id) }
      it { is_expected.to have_key(:name) }
      it { is_expected.to have_key(:events) }
    end
  end
end
