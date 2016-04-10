require 'spec_helper'

shared_examples_for 'a resource controller' do |actions = []|
  let(:model_sym) { model_name(described_class).to_sym }
  let(:model) { create(model_sym, *traits_for_factory) }
  let(:model_class) { model_sym.to_s.classify.constantize }
  # this is a hash (such as {quiz_id: <id>}) that corresponds to the path params for a nested resource
  let(:nested_lookup) { respond_to?('nested_resource_hash') ? nested_resource_hash : {} }
  # set if nested is a through model
  let(:not_a_through_model) { respond_to?('is_through_model') ? is_through_model : true }
  # will only be called if nested_lookup is defined
  let(:associated_model_class) { nested_lookup.keys.first.to_s.chomp('_id').classify.constantize }
  # an array of traits defined on the factory to be used
  let(:traits_for_factory) { respond_to?('factory_traits') ? factory_traits : [] }

  it 'is a protected api resource' do
    expect(described_class <= V1::ApiController).to be(true)
  end

  if actions.include?(:create)
    describe '#create' do
      let(:params) do
        # assume traits creates a foreign_key relationship
        if nested_lookup.empty? && traits_for_factory.empty?
          attributes_for(model_sym, *traits_for_factory)
        else
          attributes_with_foreign_keys(model_sym, *traits_for_factory)
        end
      end
      let(:to_serialize) { assigns(model_sym) }
      context 'with valid parameters' do
        it 'returns status :created' do
          post :create, **nested_lookup, model_sym => params
          expect(response).to have_http_status :created
        end

        it 'creates a record of the model' do
          params
          expect do
            post :create, **nested_lookup, model_sym => params
          end.to change { model.class.count }.by 1
        end

        it 'renders serialized json' do
          post :create, **nested_lookup, model_sym => params
          expect(JSON.parse(response.body)).to eq JSON.parse(serializable_resource.to_json)
        end
      end

      context 'on failure' do
        it 'return status :bad_request with empty json object' do
          post :create, **nested_lookup, model_sym => {}
          expect(response).to have_http_status :bad_request
        end

        it 'return status :bad_request with empty request' do
          post :create, **nested_lookup
          expect(response).to have_http_status :bad_request
        end
      end
    end
  end

  if actions.include?(:update)
    describe '#update' do
      let(:params) { attributes_for(model_sym, *traits_for_factory) }

      context 'with valid parameters' do
        let(:to_serialize) { model.reload }

        before do
          put :update, id: model.id, model_sym => params
        end

        it 'updates the model' do
          expect(JSON.parse(response.body)).to eq JSON.parse(serializable_resource.to_json)
        end

        it 'returns status :ok' do
          expect(response).to have_http_status :ok
        end
      end

      context 'with invalid parameters' do
        before do
          put :update, id: model.id, model_sym => {}
        end

        it 'returns status :bad_request' do
          expect(response).to have_http_status :bad_request
        end

        it 'renders a list of errors' do
          json = JSON.parse(response.body)
          expect(json).to have_key('error')
        end
      end

      context 'with an invalid id' do
        before do
          put :update, id: next_unused_id(model_class), model_sym => params
        end

        it 'returns status :not_found' do
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  if actions.include?(:destroy)
    describe '#destroy' do
      context 'with valid id' do
        before do
          delete :destroy, id: model.id
        end

        it 'returns status :no_content' do
          expect(response).to have_http_status :no_content
        end

        it 'renders nothing' do
          expect(response.body).to be_empty
        end
      end

      context 'with an invalid id' do
        before do
          delete :destroy, id: next_unused_id(model_class)
        end

        it 'returns status :not_found when record not found' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end

  if actions.include?(:index)
    describe '#index' do
      before do
        get :index, **nested_lookup
      end

      it 'returns status :ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders model json' do
        response_body = JSON.parse(response.body)

        # TODO: update this when pagination is implemented
        if nested_lookup.empty?
          expect(response_body.count).to eq model_class.count
        elsif not_a_through_model
          associated_model = associated_model_class.find(nested_lookup.values.first)
          expect(response_body.count).to eq associated_model.send(model_sym.to_s.pluralize).count
        else
          expect(response_body.count).to eq model_class.where(nested_lookup).count
        end
      end
    end
  end

  if actions.include?(:show)
    describe '#show' do
      context 'with valid id' do
        let(:to_serialize) { model }

        before do
          get :show, id: model.id
        end

        it 'returns status :ok' do
          expect(response).to have_http_status :ok
        end

        it 'renders model json' do
          # By serializing and then parsing using the same JSON parser we remove the
          # edge cases where serializable_resource has a much higher precision value for
          # datetimes than the parsed JSON and throws an error. This approach will also
          # correctly verify that arbitrary jsonb fields won't throw errors if the keys
          # are out of order
          expect(JSON.parse(response.body)).to eq JSON.parse(serializable_resource.to_json)
        end
      end

      context 'with an invalid id' do
        before do
          get :show, id: next_unused_id(model_class)
        end

        it 'returns status :not_found' do
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
