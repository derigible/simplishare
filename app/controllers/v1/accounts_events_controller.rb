module V1
  class AccountsEventsController < ApiController
    before_action :account_events

    def index
      respond_with @account_trans, each_serializer: V1::EventSerializer
    end

    def create
      @event = @account_trans.create(event_params)
      respond_with @event, status: :created, serializer: V1::EventSerializer
    end

    private

    def event_params
      params.require(:event).permit(:description, :amount, :is_debit, :notes, :dates)
    end

    def account_events
      @account_trans = Account.find(params[:account_id]).events
    end
  end
end
