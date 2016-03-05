module V1
  class AccountsTransactionEventsController < ApiController
    before_action :account_transaction_events

    def index
      respond_with @account_trans, each_serializer: TransactionEventSerializer
    end

    def create
      @transaction_event = @account_trans.create(transaction_event_params)
      respond_with @transaction_event, serializer: TransactionEventSerializer, status: :created
    end

    private

    def transaction_event_params
      params.require(:transaction_event).permit(:description, :amount, :is_debit, :notes, :dates)
    end

    def account_transaction_events
      @account_trans = Account.find(params[:account_id]).transaction_events
    end
  end
end
