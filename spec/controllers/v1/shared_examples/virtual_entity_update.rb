# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity update action' do
  subject { put :update, params: params.merge(updates), as: :json }

  let(:params) { { id: ve.id } }
  let(:updates) { raise 'Override in spec' }
  let(:overrides) { {} }
  let(:ve) { factory.entity overrides: { virtual_entity: { user: user }.merge(overrides) } }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  context 'with valid id' do
    it { is_expected.to have_http_status :ok }

    it 'renders expected json' do
      subject
      expect(json_schema.simple_validation_errors(json)).to be_blank
    end

    context 'not as owner' do
      let(:overrides) do
        {
          metadata: {
            permissions: %w[edit]
          }
        }
      end

      it { is_expected.to have_http_status :ok }

      context 'with permissions revoked' do
        let(:overrides) do
          {
            metadata: {
              permissions: %w[read]
            }
          }
        end

        it { is_expected.to have_http_status 403 }
      end
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
