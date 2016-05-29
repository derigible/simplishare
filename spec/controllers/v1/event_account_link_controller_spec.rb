require 'spec_helper'

module V1
  describe V1::EventAccountLinkController do
    it "is a protected api resource" do
      expect(V1::EventAccountLinkController <= V1::ApiController).to be(true)
    end

    context '#create' do
      before do
        @account = create(:account)
        @event = create(:event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, event_id: @event.id, account_id: @account.id
          expect(response).to have_http_status :created
        end

        it 'creates an events_account' do
          expect do
            post :create, event_id: @event.id, account_id: @account.id
          end.to change { EventsAccount.count }.by 1
        end

        it 'renders events_account json' do
          skip "Json output is weird right now"
          post :create, event_id: @event.id, account_id: @account.id
          expected_trans = EventsAccount.new
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq V1::EventsAccountSerializer.new(expected_trans).to_json
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, event_id: (Event.maximum(:id) + 1), account_id: @account.id
          expect(response).to have_http_status :not_found
        end
      end
    end

    context '#destroy' do
      context 'on success' do
        before do
          @account = FactoryGirl.create(:account_with_event)
          @event = @account.events.first
          @events_account = @event.events_accounts.first
          delete :destroy, event_id: @event.id, id: @events_account.id
        end

        it 'return status no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end

        it 'should have no transaction in account' do
          @account.events.reload
          expect(@account.events).to be_empty
        end

        it 'events_account should return no record found' do
          expect(
            EventsAccount.where(account_id: @account.id, event_id: @event.id)
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          max_id = EventsAccount.maximum(:id) || 0
          delete :destroy, event_id: Event.maximum(:id), id: (max_id + 1)
        end

        it 'returns a 404 for idempotent destroy' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
