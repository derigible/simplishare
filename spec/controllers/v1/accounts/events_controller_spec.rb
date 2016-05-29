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
  end
end
