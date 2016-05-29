require 'spec_helper'

module V1
  describe V1::EventCategoryLinkController do
    it "is a protected api resource" do
      expect(V1::EventCategoryLinkController <= V1::ApiController).to be(true)
    end

    context '#create' do
      before do
        @category = create(:category)
        @event = create(:event)
      end

      context 'on success' do
        it 'return status :created' do
          post :create, event_id: @event.id, category_id: @category.id
          expect(response).to have_http_status :created
        end

        it 'creates an events_account' do
          expect do
            post :create, event_id: @event.id, category_id: @category.id
          end.to change { EventsCategory.count }.by 1
        end

        it 'renders events_category json' do
          skip "Json output is weird right now"
          post :create, event_id: @event.id, category_id: @category.id
          expected_trans = EventsCategory.new
          response_body = JSON.parse(response.body)
          expected_trans.id = response_body['id']
          expect(response.body).to eq V1::EventsCategorySerializer.new(expected_trans).to_json
        end
      end

      context 'on failure' do
        it 'return status :bad_request' do
          post :create, event_id: (Event.maximum(:id) + 1), category_id: @category.id
          expect(response).to have_http_status :not_found
        end
      end
    end

    context '#destroy' do
      context 'on success' do
        before do
          @category = FactoryGirl.create(:category_with_event)
          @event = @category.events.first
          @event_category = @event.events_categories.first
          delete :destroy, event_id: @event.id, id: @event_category.id
        end

        it 'return status no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end

        it 'should have no event in category' do
          @category.events.reload
          expect(@category.events).to be_empty
        end

        it 'event_category should return no record found' do
          expect(
            EventsCategory.where(category_id: @category.id, id: @event.id)
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          max_id = EventsCategory.maximum(:id) || 0
          delete :destroy, event_id: Event.maximum(:id), id: (max_id + 1)
        end

        it 'returns a 404 for idempotent destroy' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
