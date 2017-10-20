require 'spec_helper'

module V1
  describe V1::Accounts::EventsController do
    let(:serializer) { V1::EventSerializer }

    it_behaves_like 'a resource controller', [:index] do
      let(:nested_lookup) do
        events_account = create :events_account
        { account_id: events_account.account.id }
      end
    end

    it_behaves_like 'a paginated resource' do
      let(:account) { create(:account) }
      let(:params) { { account_id: account.id } }
      let(:create_entity_list) do
        create_list :event_with_account, 5, account: account
      end
    end
  end
end
