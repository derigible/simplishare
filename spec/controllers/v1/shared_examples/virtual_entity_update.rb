# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity update action' do
  subject { put :update, params: params.merge(updates), as: :json }

  let(:params) { { id: id_to_use } }
  let(:id_to_use) { ve.id }
  let(:updates) { raise 'Override in spec' }
  let(:overrides) { {} }
  let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  context 'with missing entity body' do
    subject { put :update, params: { id: id_to_use }, as: :json }

    it { is_expected.to have_http_status :bad_request }
  end

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
    let(:id_to_use) { next_unused_id(VirtualEntity) + 1 }

    before { subject }

    it 'returns status :not_found' do
      expect(response).to have_http_status(:not_found)
    end
  end

  context 'with no access privileges' do
    let(:current_user) { create(:user) }

    it { is_expected.to have_http_status 403 }
  end

  context 'when shared' do
    shared_examples_for 'can edit' do
      it { is_expected.to have_http_status :ok }

      it 'renders expected json' do
        subject
        expect(json_schema.simple_validation_errors(json)).to be_blank
      end

      it 'sends an email to all users'
    end

    context 'when owner' do
      it_behaves_like 'can edit'
    end

    context 'when edit privileges granted' do
      let(:current_user) { create :user }
      let(:overrides) do
        {
          metadata: {
            permissions: %w[edit]
          }
        }
      end
      let(:current_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
      let(:id_to_use) { current_ve.id }

      it_behaves_like 'can edit'
    end
  end
end
