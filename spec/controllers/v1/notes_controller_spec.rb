# frozen_string_literal: true

require 'spec_helper'

describe V1::NotesController do
  it_behaves_like 'a basic entity' do
    let(:entity_factory) { Factories::NoteFactory }
    let(:entity_json_schema) { Schemas::Note }
    let(:entity_updates) { { note: { title: 'truth' } } }
    let(:entity_create_params) { { note: { body: 'truth', priority: Entity::PRIORITY_TYPES.sample } } }
    let(:entity_update_shared) { { note: { archived: true } } }
    let(:entity_record_type) { 'note' }
  end
end
