require 'spec_helper'

module V1
  describe V1::AccountTransactionEventLinkController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }

    it "is a protected api resource" do
      expect(V1::AccountTransactionEventLinkController <= V1::ApiController).to be(true)
    end

    context '#create' do
      before do
        @account = FactoryGirl.create(:account)
        @transaction_event = FactoryGirl.create(:transaction_event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, account_id: @account.id, transaction_event_id: @transaction_event.id
          expect(response).to have_http_status :created
        end

        it 'creates an accounts_transaction_event' do
          expect {
            post :create, account_id: @account.id, transaction_event_id: @transaction_event.id
          }.to change { AccountsTransactionEvent.count }.by 1
        end

        it 'renders quizzes_quiz_item json' do
          post :create, account_id: @account.id, transaction_event_id: @transaction_event.id
          expected_trans = AccountsTransactionEvent.new
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq V1::AccountsTransactionEventSerializer.new(expected_trans).to_json
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, account_id: @account.id, transaction_event_id: (TransactionEvent.maximum(:id) + 1)
          expect(response).to have_http_status :not_found
        end
      end
    end

    context '#destroy' do
      context 'on success' do
        before do
          @account = FactoryGirl.create(:account_with_transaction_event)
          @transaction_event = @account.transaction_events.first
          @accounts_transaction_event = @transaction_event.accounts_transaction_events.first
          delete :destroy, account_id: @account.id, id: @accounts_transaction_event.id
        end

        it 'return status no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end

        it 'should have no transaction in account' do
          @account.transaction_events.reload
          expect(@account.transaction_events).to be_empty
        end

        it 'accounts_transaction_event should return no record found' do
          expect(
            AccountsTransactionEvent.where(account_id: @account.id, id: @transaction_event.id)
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          max_id = AccountsTransactionEvent.maximum(:id) || 0
          delete :destroy, account_id: Account.maximum(:id), id: (max_id + 1)
        end

        it 'returns a 404 for idempotent destroy' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
