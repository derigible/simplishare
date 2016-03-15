require 'spec_helper'

shared_examples_for 'a resource controller' do |actions, link_model|
  actions = [] unless actions
  link_model = nil unless link_model

  it 'is a protected api resource' do
    expect(described_class <= V1::ApiController).to be(true)
  end

  if actions.include?(:create)
    context 'with create action' do
      before :all do
        @model_sym = model_name(described_class).to_sym
        @model = create(@model_sym)
      end

      context '#create' do
        before do
          @params = attributes_for(@model_sym)
        end
        let(:to_serialize) { assigns(@model_sym) }

        context 'on success' do
          it 'return status :created' do
            post :create, @model_sym => @params
            expect(response).to have_http_status :created
          end

          it 'creates a record of the model' do
            expect {
              post :create, @model_sym => @params
            }.to change { @model.class.count }.by 1
          end

          it "renders model's json" do
            post :create, @model_sym => @params
            expect(response.body).to eq serializable_resource.to_json
          end
        end

        context 'on failure' do
          it 'return status :bad_request with empty json object' do
            post :create, @model_sym => {}
            expect(response).to have_http_status :bad_request
          end

          it 'return status :bad_request with empty request' do
            post :create
            expect(response).to have_http_status :bad_request
          end
        end
      end
    end
  end

  if actions.include?(:update)
    context 'with update action' do
      before :all do
        model_name = model_name(described_class)
        @model_sym = model_name.to_sym
        @model_class = model_name.classify.constantize
      end

      context '#update' do
        context 'on success' do
          before do
            @model = create(@model_sym)
            @params = attributes_for(@model_sym)
            put :update, id: @model, @model_sym => @params
          end
          let(:to_serialize) { @model.reload }

          it 'updates the model' do
            expect(response.body).to eq serializable_resource.to_json
          end

          it 'returns 200 status code' do
            expect(response).to have_http_status :ok
          end
        end

        context 'on failure' do
          before(:context) do
            @model = create(@model_sym)
          end

          before do
            put :update, id: @model, @model_sym => {}
          end

          it 'returns a 400 for invalid updates' do
            expect(response).to have_http_status :bad_request
          end

          it 'returns a list of errors' do
            expect(response.body).to_not be_nil
          end
        end

        context 'with an invalid id' do
          before do
            @params = attributes_for(@model_sym)
            put :update, id: next_unused_id(@model_class), @model_sym => @params
          end

          it 'returns a 404' do
            expect(response).to have_http_status(:not_found)
          end
        end
      end
    end
  end

  if actions.include?(:destroy)
    context 'with destroy action' do
      before :all do
        @model = create(model_name(described_class).to_sym)
      end

      context '#destroy' do
        context 'on success' do
          before do
            delete :destroy, id: @model
          end

          it 'return status no_content' do
            expect(response).to have_http_status :no_content
          end

          it 'renders nothing' do
            expect(response.body).to be_empty
          end
        end

        unless link_model.nil?
          context 'on linked model destroy' do
            before do
              @link = create(link_model)
              @model_name = model_name(described_class)
              @model = @link.send(@model_name)
              @other_model = @link.send(other_model_name)
              delete :destroy, id: @model
            end

            it 'should raise RecordNotFound on table lookup' do
              expect { @link.class.find(@link.id) }.to raise_error(ActiveRecord::RecordNotFound)
            end

            it 'linked_model should have no model records' do
              expect(@other_model.send(@model_name.pluralize)).to be_empty
            end

            it 'should return empty on link table lookup by linked model ids' do
              expect(
                @link.class.where(
                  "#{@model_name}_id" => @model,
                  "#{other_model_name}_id" => @other_model
                )
              ).to be_empty
            end
          end
        end

        context 'on failure' do
          before do
            delete :destroy, id: next_unused_id(@model.class)
          end

          it 'returns a 404 when record not found' do
            expect(response).to have_http_status :not_found
          end
        end
      end
    end
  end

  if actions.include?(:index)
    context 'with index action' do
      before :all do
        @model_class = model_name(described_class).classify.constantize
      end

      context "#index" do
        before do
          get :index
        end

        it 'renders status ok' do
          expect(response).to have_http_status :ok
        end

        it 'renders model json' do
          response_body = JSON.parse(response.body)

          # TODO: update this when pagination is implemented

          expect(response_body.count).to eq @model_class.count
        end
      end
    end
  end

  if actions.include?(:show)
    context 'with show action' do
      before :all do
        @model = create(model_name(described_class).to_sym)
      end

      context '#show' do
        context 'with valid id' do
          before do
            get :show, id: @model.id
          end
          let(:to_serialize) { @model }

          it 'renders status ok' do
            expect(response).to have_http_status :ok
          end

          it 'renders model json' do
            expect(response.body).to eq serializable_resource.to_json
          end
        end

        context 'with an invalid id' do
          before do
            get :show, id: next_unused_id(@model.class)
          end

          it 'renders a 404' do
            expect(response).to have_http_status(:not_found)
          end
        end
      end
    end
  end
end
