# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity share action' do
  let(:params) { { id: id_to_use } }
  let(:id_to_use) { ve.id }
  let(:overrides) do
    {
      metadata: {
        permissions: %w[share]
      }
    }
  end
  let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
  let_once(:other_user) { create :user }
  let(:factory) { raise 'Override in spec' }

  before do
    Contact.create!(
      user: other_user,
      invitation_sent_to: 'email@example.com',
      authorization_code: SecureRandom.uuid,
      contact: user,
      authorized_on: Time.zone.now
    )
  end

  shared_examples_for 'a shared get request' do
    context 'with valid id' do
      it { is_expected.to have_http_status :ok }

      it 'renders expected json' do
        subject
        expect(json_schema.simple_validation_errors(json.first)).to be_blank
      end
    end

    context 'with an invalid id' do
      before do
        get :share, params: { id: next_unused_id(VirtualEntity) }
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

  describe 'shared_with' do
    subject { get :shared_with, params: params }

    let(:json_schema) { Schemas::SharedWith }

    before do
      factory.add_user(entity: ve.entity, user: other_user)
    end

    it_behaves_like 'a shared get request'
  end

  describe 'shareable_with' do
    subject { get :shareable_with, params: params }

    let(:json_schema) { Schemas::Contact }

    it_behaves_like 'a shared get request'
  end

  describe 'share entity' do
    subject { post :share, params: params, as: :json }

    let(:permissions) { %w[read edit] }
    let(:other_permissions) { %w[read share] }
    let(:params) do
      super().merge(
        share: {
          users: [
            { id: other_user.id, permissions: permissions }
          ]
        }
      )
    end

    it { is_expected.to have_http_status(:ok) }

    it 'creates the correct share object' do
      subject
      get :shared_with, params: { id: ve.id }
      expect(json.size).to eq 1
      expect(json.first['permissions']).to match_array(permissions)
      expect(json.first['id']).to eq other_user.id.to_s
    end

    context 'already shared users' do
      before do
        factory.add_user(entity: ve.entity, user: other_user, overrides: {metadata: {permissions: permissions}})
      end

      it 'updates permissions' do
        new_share_params = { share: { users: [{id: other_user.id, permissions: other_permissions}] } }
        post :share, params: {id: ve.id}.merge(new_share_params), as: :json
        expect(response).to have_http_status(:ok)
        get :shared_with, params: { id: ve.id }
        expect(json.size).to eq 1
        expect(json.first['permissions']).to match_array(other_permissions)
        expect(json.first['id']).to eq other_user.id.to_s
      end
    end
  end

  describe 'unshare entity' do
    subject { delete :unshare, params: params, as: :json }

    let(:overrides) do
      {
        metadata: {
          permissions: %w[owner]
        }
      }
    end
    let(:params) do
      super().merge(
        share: {
          users: [
            { id: other_user.id }
          ]
        }
      )
    end

    before do
      factory.add_user(entity: ve.entity, user: other_user, overrides: {metadata: {permissions: ['read']}})
    end

    it { is_expected.to have_http_status(:no_content) }

    it 'is expected to remove user from shared_with' do
      subject
      expect(ve.entity.shared_with_except_users([user]).count).to eq 0
    end
  end
end