require 'spec_helper'

module V1
  describe V1::Events::AccountsController do
    let(:serializer) { V1::AccountSerializer }

    it_behaves_like 'a resource controller', [:index, :create] do
      let(:nested_lookup) do
        events_account = create :events_account
        { event_id: events_account.event.id }
      end
    end

    context '#create' do
      context 'on success' do
        before :all do
          @event = create(:event)
          @params = attributes_for(:account)
        end

        it 'creates an events_account' do
          expect do
            post :create, event_id: @event.id, account: @params
          end.to change { EventsAccount.count }.by 1
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

    it_behaves_like 'a paginated resource' do
      let(:event) do
        event = create :event
        5.times { event.accounts << create(:account) }
        event
      end
      let(:params) { { event_id: event.id } }
      let(:create_entity_list) {} # noop
    end
  end
end
