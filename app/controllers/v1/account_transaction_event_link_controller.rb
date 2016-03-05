module V1
  class AccountTransactionEventLinkController < ApiController
    def create
      @account = Account.find(params[:account_id])
      @trans_event = TransactionEvent.find(params[:transaction_event_id])
      @transaction_event = AccountsTransactionEvent.create(account: @account,
                                                           transaction_event: @trans_event)
      respond_with @transaction_event, serializer: AccountsTransactionEventSerializer, status: :created
    end

    def destroy
      @account_trans = AccountsTransactionEvent.find(params[:id])
      @account_trans.destroy
      head :no_content
    end
  end
end
