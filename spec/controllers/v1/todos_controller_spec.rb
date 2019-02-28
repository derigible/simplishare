# frozen_string_literal: true

require 'spec_helper'

describe V1::TodosController do
  describe 'show' do
    it_behaves_like 'a virtual_entity show action' do
      let(:ve) { Factories::TodoFactory.entity overrides: { virtual_entity: { user: current_user } } }
      let(:json_schema) { Schemas::Todo }
    end
  end
end
