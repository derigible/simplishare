module V1::Events
  class AccountsController < V1::ApiController
    before_action :require_accounts

    def index
      respond_with @accounts, each_serializer: V1::AccountSerializer
    end

    def create
      @account = @accounts.create(account_params)
      respond_with @account, status: :created, serializer: V1::AccountSerializer
    end

    private

    def account_params
      params.require(:account).permit(:name)
    end

    def require_accounts
      @accounts = Event.find(params.require(:event_id)).accounts
    end
  end
end
