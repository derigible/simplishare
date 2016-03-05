require 'spec_helper'

module V1
  describe V1::AccountsTransactionEventsController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }

    it "is a protected api resource" do
      expect(V1::AccountsTransactionEventsController <= V1::ApiController).to be(true)
    end

    context '#index' do
      before do
        @account = FactoryGirl.create(:account_with_transaction_event)
        get :index, account_id: @account.id
      end

      it 'renders status ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders transaction_event json' do
        response_body = JSON.parse(response.body)
        expect(response_body.count).to eq 1
      end
    end

    context '#create' do
      before :all do
        @account = FactoryGirl.create(:account)
      end

      before do
        @params = FactoryGirl.attributes_for(:transaction_event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, account_id: @account.id, transaction_event: @params
          expect(response).to have_http_status :created
        end

        it 'creates a transaction_event' do
          expect {
            post :create, account_id: @account.id, transaction_event: @params
          }.to change { TransactionEvent.count }.by 1
        end

        it 'renders transaction_event json' do
          post :create, account_id: @account.id, transaction_event: @params
          expected_trans = TransactionEvent.new(@params)
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq TransactionEventSerializer.new(expected_trans).to_json
        end

        it 'creates an accounts_transaction_event' do
          expect {
            post :create, account_id: @account.id, transaction_event: @params
          }.to change { AccountsTransactionEvent.count }.by 1
        end

        it 'creates accounts_transaction_event to correct account and transaction_event' do
          post :create, account_id: @account.id, transaction_event: @params

          response_body = JSON.parse(response.body)
          at = AccountsTransactionEvent.where(
            account_id: @account.id,
            transaction_event_id: response_body['id']
          )

          expect(at).to be_truthy
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, account_id: (Account.maximum(:id) + 1), transaction_event: {}
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
