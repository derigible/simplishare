# frozen_string_literal: true

require 'spec_helper'

# required in spec: virtual_object_model, json_schema, create_params
shared_examples_for 'a virtual_objects create action' do
  subject { post :create, params: params.merge(create_params), as: :json }

  let(:params) { {} }
  let_once(:other_user) { create :user }

  it { is_expected.to have_http_status :created }

  it 'renders expected json' do
    subject
    expect(json_schema.simple_validation_errors(json)).to be_blank
  end

  it 'shows up in users list' do
    get :index
    expect(json.size).to eq 0
    subject
    get :index
    expect(JSON.parse(response.body).size).to eq 1
  end

  it 'does not show up in other users\' list' do
    subject
    expect(virtual_object_model.where(user: other_user).count).to eq 0
  end

  context 'with bad create_params' do
    let(:create_params) do
      p = super()
      p.merge(p.keys.first => { bad_param: 'title' })
    end

    it { is_expected.to have_http_status :unprocessable_entity }
  end
end
