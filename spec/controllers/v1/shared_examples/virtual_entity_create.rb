# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity create action' do
  subject { post :create, params: params.merge(create_params), as: :json }

  let(:params) { {} }
  let(:create_params) { raise 'Override in spec' }
  let(:overrides) { {} }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }
  let(:other_user) { create :user }

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

  it 'does not show up in other users list' do
    subject
    expect(VirtualEntity.where(user: other_user).count).to eq 0
  end

  context 'with bad create_params' do
    let(:create_params) do
      p = super()
      p.merge(p.keys.first => { bad_param: 'title' })
    end

    it { is_expected.to have_http_status :unprocessable_entity }
  end
end
