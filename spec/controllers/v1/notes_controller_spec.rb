# frozen_string_literal: true

require 'spec_helper'

describe V1::NotesController do
  model_factory = Factories::NoteFactory
  model_schema = Schemas::Note

  describe '#show' do
    it_behaves_like 'a virtual_entity show action' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
    end
  end

  describe '#index' do
    it_behaves_like 'a virtual_entity index action' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
    end
  end

  describe '#destroy' do
    it_behaves_like 'a virtual_entity destroy action' do
      let(:factory) { model_factory }
    end
  end

  describe '#update' do
    it_behaves_like 'a virtual_entity update action' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
      let(:updates) { { note: { title: 'truth' } } }
    end
  end

  describe '#create' do
    it_behaves_like 'a virtual_entity create action' do
      let(:json_schema) { model_schema }
      let(:create_params) { { note: { body: 'truth', priority: Entity::PRIORITY_TYPES.sample } } }
    end
  end

  describe '#archiving' do
    it_behaves_like 'an archivable entity' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
      let(:update_shared) { { note: { archived: true } } }
    end
  end

  describe '#snoozing' do
    it_behaves_like 'a snoozable entity' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
    end
  end
end
