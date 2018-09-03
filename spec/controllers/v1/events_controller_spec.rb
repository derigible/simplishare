# frozen_string_literal: true

require 'spec_helper'

module V1
  describe V1::EventsController do
    let(:serializer) { V1::Detailed::EventSerializer }

    it_behaves_like 'a resource controller', %i[index show update create destroy], EventsAccount
    it_behaves_like 'a resource controller with has_many-through association', [:destroy], :events_account, 'account'
    it_behaves_like 'a resource controller with has_many-through association', [:destroy], :events_category, 'category'

    describe '#bulk_create' do
      context 'on success' do
        let(:upload) { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'events_mint.csv'), 'text/plain') }

        it 'has http code 200 success' do
          post :bulk_create, params: { upload: upload }
          expect(response).to have_http_status :created
        end

        it 'creates events for each row in csv' do
          expect { post :bulk_create, params: { upload: upload } }.to change { Event.count }.by 10
        end
      end

      context 'on failure' do
        let(:upload) { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'events.csv'), 'text/plain') }

        it 'has http code 400 bad request' do
          post :bulk_create, params: { upload: upload }
          expect(response).to have_http_status :bad_request
        end

        it 'does not create any events' do
          expect { post :bulk_create, params: { upload: upload } }.to change { Event.count }.by 0
        end
      end
    end

    it_behaves_like 'a paginated resource' do
      let(:create_entity_list) do
        create_list :event, 5
      end
    end
  end
end
