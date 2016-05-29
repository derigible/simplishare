require 'spec_helper'

module V1
  describe V1::Categories::EventsController do
    let(:serializer) { V1::EventSerializer }

    it_behaves_like 'a resource controller', [:index] do
      let(:nested_lookup) do
        events_category = create :events_category
        { category_id: events_category.category.id }
      end
    end

    it_behaves_like 'a paginated resource' do
      let(:category) { create(:category) }
      let(:params) { { category_id: category.id } }
      let(:create_entity_list) do
        create_list :event_with_category, 5, category: category
      end
    end
  end
end
