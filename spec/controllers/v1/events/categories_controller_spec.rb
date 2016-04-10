require 'spec_helper'

module V1
  describe V1::Events::CategoriesController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }
    let(:serializer) { V1::CategorySerializer }

    let(:nested_resource_hash) do
      events_category = create :events_category
      { event_id: events_category.event.id }
    end

    it_behaves_like 'a resource controller', [:index, :create]

    context '#create' do
      context 'on success' do
        before :all do
          @event = create(:event)
          @params = attributes_for(:category)
        end

        it 'creates an events_category' do
          expect {
            post :create, event_id: @event, category: @params
          }.to change { EventsCategory.count }.by 1
        end

        it 'creates events_category to correct category and event' do
          post :create, event_id: @event, category: @params

          response_body = JSON.parse(response.body)
          ce = EventsCategory.where(
            event_id: @event.id,
            category_id: response_body['id']
          )

          expect(ce).not_to be_empty
        end
      end
    end
  end
end
