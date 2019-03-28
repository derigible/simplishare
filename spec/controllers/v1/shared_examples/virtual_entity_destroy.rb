# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity destroy action' do
  subject { delete :destroy, params: params }

  let(:params) { { id: id_to_use } }
  let(:id_to_use) { ve.id }
  let(:overrides) { {} }
  let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
  let(:factory) { raise 'Override in spec' }

  context 'with valid id' do
    it { is_expected.to have_http_status :no_content }

    it 'renders expected json' do
      subject
      expect(response.body).to be_blank
    end

    context 'not as owner' do
      let(:overrides) do
        {
          metadata: {
            permissions: %w[edit]
          }
        }
      end
      let(:current_user) { create :user }
      let(:other_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
      let(:id_to_use) { other_ve.id }

      before do
        ve
        other_ve
      end

      it 'does not destroy entity' do
        expect { subject }.to change(Entity, :count).by(0)
      end

      it 'does destroy virtual_entity' do
        expect { subject }.to change(VirtualEntity, :count).by(-1)
      end
    end

    context 'as owner' do
      it 'does destroy entity' do
        ve
        expect { subject }.to change(Entity, :count).by(-1)
      end

      it 'does destroy virtual_entity' do
        ve
        expect { subject }.to change(VirtualEntity, :count).by(-1)
      end
    end

    context 'with destroy permissions' do
      let(:overrides) do
        {
          metadata: {
            permissions: %w[destroy]
          }
        }
      end
      let(:current_user) { create :user }
      let(:other_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
      let(:id_to_use) { other_ve.id }

      before { ve }

      it 'does destroy entity' do
        expect { subject }.to change(Entity, :count).by(-1)
      end

      it 'does destroy virtual_entity' do
        expect { subject }.to change(VirtualEntity, :count).by(-1)
      end
    end
  end

  context 'with an invalid id' do
    before do
      delete :destroy, params: { id: next_unused_id(VirtualEntity) }
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
