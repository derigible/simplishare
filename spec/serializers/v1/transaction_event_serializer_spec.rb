require 'spec_helper'

module V1
  describe V1::TransactionEventSerializer do

    describe 'serializer structure' do
      subject { TransactionEventSerializer.new(create(:transaction_event)).attributes }

      it { is_expected.to have_key(:id) }
      it { is_expected.to have_key(:account_id) }
      it { is_expected.to have_key(:description) }
      it { is_expected.to have_key(:amount) }
      it { is_expected.to have_key(:is_debit) }
      it { is_expected.to have_key(:notes) }

      # TODO: Add back in the dates

      # it { is_expected.to have_key(:created_at) }
      # it { is_expected.to have_key(:updated_at) }
    end
  end
end
