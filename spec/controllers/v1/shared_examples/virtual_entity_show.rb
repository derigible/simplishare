# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity show action' do
  subject { get :show, params: params }

  let(:params) { { id: ve.id } }
  let(:ve) { factory.entity overrides: { virtual_entity: { user: user } } }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  context 'with valid id' do
    it { is_expected.to have_http_status :ok }

    it 'renders expected json' do
      subject
      expect(json_schema.simple_validation_errors(json)).to be_blank
    end
  end

  context 'with an invalid id' do
    before do
      get :show, params: { id: next_unused_id(VirtualEntity) }
    end

    it 'returns status :not_found' do
      expect(response).to have_http_status(:not_found)
    end
  end

  context 'with no access privileges' do
    let(:current_user) { create(:user) }

    it { is_expected.to have_http_status 403 }
  end
end
