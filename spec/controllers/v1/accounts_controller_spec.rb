require 'spec_helper'

module V1
  describe V1::AccountsController do
    before(:each) { request.headers['Accept'] = "application/vnd.budgetr.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }

    it "is a protected api resource" do
      expect(V1::AccountsController <= V1::ApiController).to be(true)
    end

    context '#index' do
      before do
        3.times { FactoryGirl.create(:account) }
        get :index
      end

      it 'renders status ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders quiz_item json' do
        response_body = JSON.parse(response.body)

        expect(response_body['accounts'].count).to eq Account.all.count
      end
    end

    context '#create' do
      before do
        @params = FactoryGirl.attributes_for(:account)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, account: @params
          expect(response).to have_http_status :created
        end

        it 'creates an account' do
          expect {
            post :create, account: @params
          }.to change { Account.count }.by 1
        end

        it 'renders account json' do
          post :create, account: @params
          expected_account = Account.new(@params)
          response_body = JSON.parse(response.body)
          expected_account.id = response_body['id']
          expect(response.body).to eq AccountSerializer.new(expected_account).to_json
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, account: {}
          expect(response).to have_http_status :bad_request
        end
      end
    end

    context '#show' do
      context 'with valid id' do
        before do
          @account = FactoryGirl.create(:account)
          get :show, id: @account.id
        end

        it 'renders status ok' do
          expect(response).to have_http_status :ok
        end

        it 'renders account json' do
          expect(response.body).to eq AccountSerializer.new(@account).to_json
        end
      end

      context 'with an invalid id' do
        before do
          expect(Account.where(id: 1000).count).to eq(0), 'precondition'
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
          @account = create(:account)
          put :update, id: @account.id, account: { name: Faker::StarWars.droid }
        end

        it 'updates the account' do
          expect(response.body).to eq AccountSerializer.new(@account.reload).to_json
        end

        it 'returns 200 status code' do
          expect(response).to have_http_status :ok
        end
      end

      context 'on failure' do
        before(:context) do
          @account = create(:account)
        end

        before do
          put :update, id: @account.id, account: {}
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
          delete :destroy, id: @account.id
        end

        it 'return status no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end

        it 'should have no accounts in quiz' do
          @transaction_event.reload
          expect(@transaction_event.accounts).to be_empty
        end

        it 'accounts_transaction_events should return no record found' do
          expect(
            AccountsTransactionEvent.where(account_id: @account.id, transaction_event_id: @transaction_event.id)
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          max_id = Account.maximum(:id) || 0
          delete :destroy, id: (max_id + 1)
        end

        it 'returns a 404 for idempotent destroy' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
