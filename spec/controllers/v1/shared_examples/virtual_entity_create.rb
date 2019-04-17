# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity create action' do
  it_behaves_like 'a virtual_objects create action' do
    let(:virtual_object_model) { VirtualEntity }
  end
end
