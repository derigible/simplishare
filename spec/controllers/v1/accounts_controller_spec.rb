require 'spec_helper'

module V1
  describe V1::AccountsController do
    serializer_override_hash = { show: V1::Detailed::AccountSerializer }
    let(:serializer) { serializer_override_hash.fetch(action, V1::AccountSerializer) }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy]
  end
end
