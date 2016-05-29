require 'spec_helper'

module V1
  describe V1::CategoriesController do
    serializer_override_hash = { show: V1::Detailed::CategorySerializer }
    let(:serializer) { serializer_override_hash.fetch(action, V1::CategorySerializer) }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy], EventsCategory
  end
end
