# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity show action' do
  subject { get :show, params: params }

  let(:params) { { id: id_to_use } }
  let(:id_to_use) { ve.id }
  let(:overrides) { {} }
  let_once(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
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

  context 'with permissions revoked' do
    let(:overrides) do
      {
        metadata: {
          permissions: %w[]
        }
      }
    end
    let(:current_user) { create :user }
    let(:other_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
    let(:id_to_use) { other_ve.id }

    it { is_expected.to have_http_status 403 }
  end
end
