# frozen_string_literal: true

require 'spec_helper'

describe V1::NotesController do
  note_factory = Factories::NoteFactory
  note_schema = Schemas::Note

  describe '#show' do
    it_behaves_like 'a virtual_entity show action' do
      let(:factory) { note_factory }
      let(:json_schema) { note_schema }
    end
  end

  describe '#index' do
    it_behaves_like 'a virtual_entity index action' do
      let(:factory) { note_factory }
      let(:json_schema) { note_schema }
    end
  end

  describe '#destroy' do
    it_behaves_like 'a virtual_entity destroy action' do
      let(:factory) { note_factory }
    end
  end

  describe '#update' do
    it_behaves_like 'a virtual_entity update action' do
      let(:factory) { note_factory }
      let(:json_schema) { note_schema }
      let(:updates) { { note: { title: 'truth' } } }
    end
  end

  xdescribe '#archiving' do
    it_behaves_like 'an archivable entity'
  end
end
