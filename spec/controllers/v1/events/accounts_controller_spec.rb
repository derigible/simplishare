require 'spec_helper'

module V1
  describe V1::Events::AccountsController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }
    let(:serializer) { V1::AccountSerializer }

    let(:nested_resource_hash) do
      events_account = create :events_account
      { event_id: events_account.event.id }
    end

    it_behaves_like 'a resource controller', [:index, :create]

    context '#create' do
      context 'on success' do
        before :all do
          @event = create(:event)
          @params = attributes_for(:account)
        end

        it 'creates an events_account' do
          expect {
            post :create, event_id: @event.id, account: @params
          }.to change { EventsAccount.count }.by 1
        end

        it 'creates events_account to correct account and event' do
          post :create, event_id: @event.id, account: @params

          response_body = JSON.parse(response.body)
          at = EventsAccount.where(
            event_id: @event.id,
            account_id: response_body['id']
          )

          expect(at).not_to be_empty
        end
      end
    end
  end
end
