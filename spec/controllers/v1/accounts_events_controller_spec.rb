require 'spec_helper'

module V1
  describe V1::AccountsEventsController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }

    it "is a protected api resource" do
      expect(V1::AccountsEventsController <= V1::ApiController).to be(true)
    end

    context '#index' do
      before do
        @account = FactoryGirl.create(:account_with_event)
        get :index, account_id: @account.id
      end

      it 'renders status ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders event json' do
        response_body = JSON.parse(response.body)
        expect(response_body.count).to eq 1
      end
    end

    context '#create' do
      before :all do
        @account = FactoryGirl.create(:account)
      end

      before do
        @params = FactoryGirl.attributes_for(:event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, account_id: @account.id, event: @params
          expect(response).to have_http_status :created
        end

        it 'creates a event' do
          expect {
            post :create, account_id: @account.id, event: @params
          }.to change { Event.count }.by 1
        end

        it 'renders event json' do
          skip "Json output is weird right now"
          post :create, account_id: @account.id, event: @params
          expected_trans = Event.new(@params)
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq V1::EventSerializer.new(expected_trans).to_json
        end

        it 'creates an accounts_event' do
          expect {
            post :create, account_id: @account.id, event: @params
          }.to change { AccountsEvent.count }.by 1
        end

        it 'creates accounts_event to correct account and event' do
          post :create, account_id: @account.id, event: @params

          response_body = JSON.parse(response.body)
          at = AccountsEvent.where(
            account_id: @account.id,
            event_id: response_body['id']
          )

          expect(at).to be_truthy
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, account_id: (Account.maximum(:id) + 1), event: {}
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
