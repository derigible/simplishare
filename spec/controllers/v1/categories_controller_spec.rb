require 'spec_helper'

module V1
  describe V1::CategoriesController do
    serializer_override_hash = { show: V1::Detailed::CategorySerializer }
    let(:serializer) { serializer_override_hash.fetch(action, V1::CategorySerializer) }

    it_behaves_like 'a resource controller', [:index, :show, :update, :create, :destroy], EventsCategory

    it_behaves_like 'a paginated resource' do
      let(:create_entity_list) do
        create_list :category, 5
      end
    end
  end
end
