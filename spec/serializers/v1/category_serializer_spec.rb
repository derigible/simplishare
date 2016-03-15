require 'spec_helper'

module V1
  describe V1::CategorySerializer do

    describe 'serializer structure' do
      subject { CategorySerializer.new(create(:category)).attributes }

      it { is_expected.to have_key(:id) }
      it { is_expected.to have_key(:title) }

      # TODO: Add back in the dates

      # it { is_expected.to have_key(:created_at) }
      # it { is_expected.to have_key(:updated_at) }
    end
  end
end
