require 'spec_helper'

shared_examples_for "a nested resource controller" do |action|
  case action
  when :create
    let(:model) { create(factory) }
    let(:params) { attributes_for(nested_attrs.to_sym) }
    let(:to_serialize) { assigns(nested_attrs.to_sym) }

    context 'on success' do
      it 'return status :created' do
        post :create, "#{factory}_id" => model, nested_attrs => params
        expect(response).to have_http_status :created
      end

      it 'creates a record' do
        expect {
          post :create, "#{factory}_id" => model, nested_attrs => params
        }.to change { model_name(described_class).classify.constantize.count }.by 1
      end

      it 'renders model json' do
        post :create, "#{factory}_id" => model, nested_attrs => params
        expect(response.body).to eq serializable_resource.to_json
      end
    end

    context 'on failure' do
      it 'return status :not_found' do
        id = next_unused_id(model.class)
        post :create, "#{factory}_id" => id, nested_attrs => {}
        expect(response).to have_http_status :not_found
      end
    end
  when :index
    let(:model) { create(factory) }
    let(:associated) { model.send(associated_name) }

    before do
      get :index, "#{associated_name}_id" => associated
    end

    it 'renders status ok' do
      expect(response).to have_http_status :ok
    end

    it 'renders array of models json' do
      response_body = JSON.parse(response.body)
      expect(response_body.count).to be > 0
    end
  end
end
