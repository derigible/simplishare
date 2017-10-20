require 'spec_helper'

module V1
  describe V1::AccountsController do
    serializer_override_hash = { show: V1::Detailed::AccountSerializer }
    let(:serializer) { serializer_override_hash.fetch(action, V1::AccountSerializer) }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy]

    it_behaves_like 'a paginated resource' do
      let(:create_entity_list) do
        create_list :account, 5
      end
    end
  end
end
