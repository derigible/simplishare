require 'spec_helper'

module V1
  describe V1::TransactionEventsController do
    before(:each) { request.headers['Accept'] = "application/vnd.budgetr.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }
    let(:other_model_name) { 'account' }
    let(:serializer) { V1::TransactionEventSerializer }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy], AccountsTransactionEvent
  end
end
