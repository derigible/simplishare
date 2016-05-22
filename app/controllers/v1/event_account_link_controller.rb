module V1
  class EventAccountLinkController < ApiController
    def create
      @account = Account.find(params[:account_id])
      @trans_event = Event.find(params[:event_id])
      @event = EventsAccount.create(account: @account,
                                    event: @trans_event)
      respond_with @event, serializer: EventsAccountSerializer, status: :created
    end

    def destroy
      @account_trans = EventsAccount.find(params[:id])
      @account_trans.destroy
      head :no_content
    end
  end
end
