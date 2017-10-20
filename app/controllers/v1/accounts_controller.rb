module V1
  class AccountsController < ApiController
    before_action :load_account

    def index
      @accounts = ApiPagination.paginate policy_scope(Account)
      respond_with @accounts, each_serializer: AccountSerializer
    end

    def update
      @account.update(account_params)
      respond_with @account, status: :ok, serializer: AccountSerializer
    end

    def create
      @account = Account.new(account_params)
      authorize @account
      @account.save
      respond_with @account, status: :created, serializer: AccountSerializer
    end

    def show
      respond_with @account, serializer: V1::Detailed::AccountSerializer
    end

    def destroy
      @account.destroy
      head :no_content
    end

    private

    def load_account
      @account = Account.find params[:id]
      authorize @account
    end

    def account_params
      params.require(:account).permit(:name)
    end
  end
end
