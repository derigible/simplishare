# frozen_string_literal: true

module V1
  module Events
    class AccountsController < V1::ApiController
      def index
        @accounts = ApiPagination.paginate policy_scope(default_scope)
        respond_with @accounts, each_serializer: AccountSerializer
      end

      def create
        @account = default_scope.create(account_params)
        authorize @account
        respond_with @account, status: :created, serializer: AccountSerializer
      end

      private

      def account_params
        params.require(:account).permit(:name)
      end

      def default_scope
        Event.find(params.require(:event_id)).accounts
      end
    end
  end
end
