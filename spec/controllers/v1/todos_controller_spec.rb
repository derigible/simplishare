# frozen_string_literal: true

require 'spec_helper'

describe V1::TodosController do
  it_behaves_like 'a basic entity' do
    let(:entity_factory) { Factories::TodoFactory }
    let(:entity_json_schema) { Schemas::Todo }
    let(:entity_updates) { { todo: { title: 'truth' } } }
    let(:entity_create_params) { { todo: { title: 'truth', priority: Entity::PRIORITY_TYPES.sample } } }
    let(:entity_update_shared) { { todo: { archived: true } } }
    let(:entity_record_type) { 'todo' }
  end
end
