module V1
  class TransactionEventsController < ApiController
    def index
      @transaction_events = TransactionEvent.all
      respond_with @transaction_events, each_serializer: V1::TransactionEventSerializer
    end

    def update
      @transaction_event = TransactionEvent.find(params[:id])
      @transaction_event.update(transaction_event_params)
      respond_with @transaction_event, status: :ok, serializer: V1::TransactionEventSerializer
    end

    def create
      @transaction_event = TransactionEvent.new(transaction_event_params)
      @transaction_event.save
      respond_with @transaction_event, status: :created, serializer: V1::TransactionEventSerializer
    end

    def show
      @transaction_event = TransactionEvent.find(params[:id])
      respond_with @transaction_event, serializer: V1::TransactionEventSerializer
    end

    def destroy
      @transaction_event = TransactionEvent.find(params[:id])
      @transaction_event.destroy
      head :no_content
    end

    private

    def transaction_event_params
      params.require(:transaction_event).permit(:description, :amount, :is_debit, :notes, :dates)
    end
  end
end
