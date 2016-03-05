require 'spec_helper'

module V1
  describe V1::TransactionEventsController do
    before(:each) { request.headers['Accept'] = "application/vnd.budgetr.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }

    it "is a protected api resource" do
      expect(V1::TransactionEventsController <= V1::ApiController).to be(true)
    end

    context '#index' do
      before do
        3.times { FactoryGirl.create(:transaction_event) }
        get :index
      end

      it 'renders status ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders transaction_event json' do
        response_body = JSON.parse(response.body)

        expect(response_body['transaction_events'].count).to eq TransactionEvent.all.count
      end
    end

    context '#create' do
      before do
        @params = FactoryGirl.attributes_for(:transaction_event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, transaction_event: @params
          expect(response).to have_http_status :created
        end

        it 'creates a transaction_event' do
          expect {
            post :create, transaction_event: @params
          }.to change { TransactionEvent.count }.by 1
        end

        it 'renders transaction_event json' do
          post :create, transaction_event: @params
          expected_trans = TransactionEvent.new(@params)
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq TransactionEventSerializer.new(expected_trans).to_json
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, transaction_event: {}
          expect(response).to have_http_status :bad_request
        end
      end
    end

    context '#show' do
      context 'with valid id' do
        before do
          @transaction_event = FactoryGirl.create(:transaction_event)
          get :show, id: @transaction_event.id
        end

        it 'renders status ok' do
          expect(response).to have_http_status :ok
        end

        it 'renders transaction_event json' do
          expect(response.body).to eq TransactionEventSerializer.new(@transaction_event).to_json
        end
      end

      context 'with an invalid id' do
        before do
          expect(TransactionEvent.where(id: 1000).count).to eq(0), 'precondition'
          get :show, id: 1000
        end

        it 'renders a 404' do
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context '#update' do
      context 'on success' do
        before do
          @transaction_event = create(:transaction_event)
          put :update, id: @transaction_event, transaction_event: { description: Faker::StarWars.quote }
        end

        it 'updates the transaction_event' do
          expect(response.body).to eq TransactionEventSerializer.new(@transaction_event.reload).to_json
        end

        it 'returns 200 status code' do
          expect(response).to have_http_status :ok
        end
      end

      context 'on failure' do
        before(:context) do
          @transaction_event = create(:transaction_event)
        end

        before do
          put :update, id: @transaction_event.id, transaction_event: {}
        end

        it 'returns a 400 for invalid updates' do
          expect(response).to have_http_status :bad_request
        end

        it 'returns a list of errors' do
          expect(response.body).to_not be_nil
        end
      end
    end

    context '#destroy' do
      context 'on success' do
        before do
          @account = FactoryGirl.create(:account_with_transaction_event)
          @transaction_event = @account.transaction_events.first
          delete :destroy, id: @transaction_event.id
        end

        it 'return status no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end

        it 'should have no accounts in transaction_event' do
          @account.reload
          expect(@transaction_event.accounts).to be_empty
        end

        it 'accounts_transaction_event should return no record found' do
          expect(
            AccountsTransactionEvent.where(account_id: @account.id, transaction_event_id: @transaction_event.id)
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          max_id = TransactionEvent.maximum(:id) || 0
          delete :destroy, id: (max_id + 1)
        end

        it 'returns a 404 for idempotent destroy' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
