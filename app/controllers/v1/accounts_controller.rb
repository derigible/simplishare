module V1
  class AccountsController < ApiController
    def index
      @accounts = Account.all
      respond_with @accounts
    end

    def update
      @account = Account.find(params[:id])
      @account.update(account_params)
      respond_with @account, status: :ok
    end

    def create
      @account = Account.new(account_params)
      @account.save
      respond_with @account, status: :created
    end

    def show
      @account = Account.find(params[:id])
      respond_with @account
    end

    def destroy
      @account = Account.find(params[:id])
      @account.destroy
      head :no_content
    end

    private

    def account_params
      params.require(:account).permit(:name)
    end
  end
end
