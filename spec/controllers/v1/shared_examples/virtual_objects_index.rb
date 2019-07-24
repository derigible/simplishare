# frozen_string_literal: true

require 'spec_helper'

# make sure that json_schema, params, and factory are all
# within scope of this shared_examples in order for it to work
shared_examples_for 'a virtual_objects index action' do |skip_paginate = false|
  subject { get :index, params: params }

  it { is_expected.to have_http_status :ok }

  it 'returns correct number' do
    subject
    expect(json.size).to be(3)
  end

  it 'renders expected json' do
    subject
    json.each do |j|
      expect(json_schema.simple_validation_errors(j)).to be_blank
    end
  end

  context 'with other users' do
    let(:current_user) { create :user }

    before do
      2.times.each { factory.entity overrides: { virtual_object: { user: current_user } } }
    end

    it 'returns correct number' do
      subject
      expect(json.size).to be(2)
    end
  end

  unless skip_paginate
    it_behaves_like 'a paginated resource' do
      let(:create_entity_list) do
        ->(number) { number.times.each { factory.entity overrides: { virtual_object: { user: user } } } }
      end
    end
  end
end
