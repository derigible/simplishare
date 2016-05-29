module V1::Events
  class AccountsController < V1::ApiController
    def index
      @accounts = paginate nested_scope
      respond_with @accounts, each_serializer: V1::AccountSerializer
    end

    def create
      @account = nested_scope.create(account_params)
      respond_with @account, status: :created, serializer: V1::AccountSerializer
    end

    private

    def account_params
      params.require(:account).permit(:name)
    end

    def nested_scope
      Event.find(params.require(:event_id)).accounts
    end
  end
end
