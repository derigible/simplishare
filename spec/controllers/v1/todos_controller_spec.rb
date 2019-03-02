# frozen_string_literal: true

require 'spec_helper'

describe V1::TodosController do
  describe '#show' do
    it_behaves_like 'a virtual_entity show action' do
      let(:factory) { Factories::TodoFactory }
      let(:json_schema) { Schemas::Todo }
    end
  end

  describe '#index' do
    it_behaves_like 'a virtual_entity index action' do
      let(:factory) { Factories::TodoFactory }
      let(:json_schema) { Schemas::Todo }
    end
  end

  describe '#destroy' do
    it_behaves_like 'a virtual_entity destroy action' do
      let(:factory) { Factories::NoteFactory }
      let(:json_schema) { Schemas::Note }
    end
  end

  describe '#update' do
    it_behaves_like 'a virtual_entity update action' do
      let(:factory) { Factories::TodoFactory }
      let(:json_schema) { Schemas::Todo }
      let(:updates) { { todo: { title: 'truth' } } }
    end
  end

  describe '#archiving' do
    it_behaves_like 'an archivable entity'
  end
end
