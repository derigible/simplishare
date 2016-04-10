require 'spec_helper'

shared_examples_for 'a resource controller with has_many-through association' do |actions = [], link_model_factory, association_name|
  let(:link_model) { create(link_model_factory) }
  let(:associated_model) { link_model.send(association_name) }

  let(:model_sym) { model_name(described_class).to_sym }
  let(:model) { link_model.send(model_sym.to_s) }
  let(:model_class) { model_sym.to_s.classify.constantize }

  if actions.include?(:destroy)
    describe '#destroy' do
      let(:to_serialize) { assigns(model_sym) }
      context 'on success' do
        before do
          delete :destroy, id: model
        end

        it 'should raise RecordNotFound on table lookup' do
          expect { link_model.class.find(link_model.id) }.to raise_error(ActiveRecord::RecordNotFound)
        end

        it 'destroys linked_model record' do
          expect(associated_model.send(model_sym.to_s.pluralize)).to be_empty
        end

        it 'should return empty on link table lookup by associated model ids' do
          expect(
            link_model.class.where(
              "#{model_sym}_id" => model,
              "#{association_name}_id" => associated_model
            )
          ).to be_empty
        end
      end

      context 'on failure' do
        before do
          delete :destroy, id: next_unused_id(model_class)
        end

        it 'returns a 404 when record not found' do
          expect(response).to have_http_status :not_found
        end
      end
    end
  end
end
