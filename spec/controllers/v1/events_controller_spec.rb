require 'spec_helper'

module V1
  describe V1::EventsController do
    before(:each) { request.headers['Accept'] = "application/vnd.budgetr.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }
    let(:serializer) { EventSerializer }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy], EventsAccount
    it_behaves_like 'a resource controller with has_many-through association', [:destroy], :events_account, 'account'
    it_behaves_like 'a resource controller with has_many-through association', [:destroy], :events_category, 'category'
  end
end
