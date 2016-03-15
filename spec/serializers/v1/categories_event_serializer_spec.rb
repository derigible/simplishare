require 'spec_helper'

module V1
  describe V1::CategoriesEventSerializer do

    describe 'serializer structure' do
      subject { CategoriesEventSerializer.new(create(:categories_event)).attributes }

      it { is_expected.to have_key(:id) }
    end
  end
end
