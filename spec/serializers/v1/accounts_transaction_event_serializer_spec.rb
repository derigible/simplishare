require 'spec_helper'

module V1
  describe V1::AccountsTransactionEventSerializer do

    describe 'serializer structure' do
      subject { AccountsTransactionEventSerializer.new(create(:accounts_transaction_event)).attributes }

      it { is_expected.to have_key(:id) }
    end
  end
end
