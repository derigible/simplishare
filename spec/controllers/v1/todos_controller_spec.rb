# frozen_string_literal: true

require 'spec_helper'

describe V1::TodosController do
  model_factory = Factories::TodoFactory
  model_schema = Schemas::Todo
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
      let(:updates) { { todo: { title: 'truth' } } }
    end
  end

  describe '#archiving' do
    it_behaves_like 'an archivable entity' do
      let(:factory) { model_factory }
      let(:json_schema) { model_schema }
    end
  end
end
