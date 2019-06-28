# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a basic entity' do
  let(:entity_factory) { Factories::TodoFactory }
  let(:entity_json_schema) { Schemas::Todo }
  let(:entity_updates) { { todo: { title: 'truth' } } }
  let(:entity_create_params) { { todo: { title: 'truth', priority: Entity::PRIORITY_TYPES.sample } } }
  let(:entity_update_shared) { { todo: { archived: true } } }
  let(:entity_record_type) { 'todo' }

  describe '#show' do
    it_behaves_like 'a virtual_entity show action' do
      let(:factory) { entity_factory }
      let(:json_schema) { entity_json_schema }
    end
  end

  describe '#index' do
    it_behaves_like 'a virtual_entity index action' do
      let(:factory) { entity_factory }
      let(:json_schema) { entity_json_schema }
    end
  end

  describe '#destroy' do
    it_behaves_like 'a virtual_entity destroy action' do
      let(:factory) { entity_factory }
    end
  end

  describe '#update' do
    it_behaves_like 'a virtual_entity update action' do
      let(:factory) { entity_factory }
      let(:json_schema) { entity_json_schema }
      let(:updates) { entity_updates }
    end
  end

  describe '#create' do
    it_behaves_like 'a virtual_entity create action' do
      let(:json_schema) { entity_json_schema }
      let(:create_params) { entity_create_params }
    end
  end

  describe '#archiving' do
    it_behaves_like 'an archivable entity' do
      let(:factory) { entity_factory }
      let(:json_schema) { entity_json_schema }
      let(:update_shared) { entity_update_shared }
    end
  end

  describe '#snoozing' do
    it_behaves_like 'a snoozable entity' do
      let(:factory) { entity_factory }
      let(:json_schema) { entity_json_schema }
    end
  end

  describe '#sharing' do
    it_behaves_like 'a virtual_entity share action' do
      let(:factory) { entity_factory }
    end
  end

  describe '#preferences' do
    it_behaves_like 'an entity with preferences' do
      let(:factory) { entity_factory }
      let(:record_type) { entity_record_type }
    end
  end
end
