require 'spec_helper'

module V1
  describe V1::AccountsEventSerializer do

    describe 'serializer structure' do
      subject { AccountsEventSerializer.new(create(:accounts_event)).attributes }

      it { is_expected.to have_key(:id) }
    end
  end
end
