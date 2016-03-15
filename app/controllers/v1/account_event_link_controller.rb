module V1
  class AccountEventLinkController < ApiController
    def create
      @account = Account.find(params[:account_id])
      @trans_event = Event.find(params[:event_id])
      @event = AccountsEvent.create(account: @account,
                                    event: @trans_event)
      respond_with @event, serializer: V1::AccountsEventSerializer, status: :created
    end

    def destroy
      @account_trans = AccountsEvent.find(params[:id])
      @account_trans.destroy
      head :no_content
    end
  end
end
