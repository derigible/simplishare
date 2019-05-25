# frozen_string_literal: true

require 'spec_helper'

describe V1::TagsController do
  model_factory = Factories::TagFactory
  model_schema = Schemas::Tag

  describe '#index' do
    let(:factory) { model_factory }
    let(:json_schema) { model_schema }
    let(:params) { {} }

    before :once do
      3.times.each { factory.entity overrides: { virtual_object: { user: user } } }
    end

    it_behaves_like 'a virtual_objects index action'
  end

  describe '#create' do
    it_behaves_like 'a virtual_objects create action' do
      let(:virtual_object_model) { VirtualTag }
      let(:json_schema) { model_schema }
      let(:create_params) { { tag: { name: 'truth' } } }
    end
  end
end
