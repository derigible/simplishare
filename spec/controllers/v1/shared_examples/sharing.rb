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
  let_once(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
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
        expect(json_schema.simple_validation_errors(json)).to be_blank
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

    context 'with permissions revoked' do
      let(:overrides) do
        {
          metadata: {
            permissions: %w[]
          }
        }
      end
      let(:current_user) { other_user }
      let(:other_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
      let(:id_to_use) { other_ve.id }

      it { is_expected.to have_http_status 403 }
    end
  end

  describe 'shared_with' do
    subject { get :shared_with, params: params }

    let(:json_schema) { raise 'Not implemented' }

    it_behaves_like 'a shared get request'
  end

  describe 'shareable_with' do
    subject { get :shareable_with, params: params }

    let(:json_schema) { raise 'Not Implemented' }

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
      get :share_details, params: { id: ve.id }
      expect(json[:shared_with].size).to eq 1
      expect(json[:shared_with].first['permissions']).to match_array(permissions)
      expect(json[:shared_with].first['id']).to eq other_user.id.to_s
    end

    it 'updates permissions for already shared users' do
      subject
      expect(json[:shared_with].first.permissions).to match_array(permissions)
      new_share_params = { share: { users: [{id: id_to_use, permissions: other_permissions}] } }
      post :share, params: {id: ve.id}.merge(new_share_params), as: :json
      expect(response).to have_http_status(:ok)
      get :share_details, params: { id: ve.id }
      expect(json[:shared_with].size).to eq 1
      expect(json[:shareable_with].size).to eq 0
      expect(json[:shared_with].first['permissions']).to match_array(other_permissions)
      expect(json[:shared_with].first['id']).to eq other_user.id.to_s
    end
  end

  describe 'unshare entity' do
    subject { delete :share, params: params, as: :json }

    let(:other_user) { create :user }
    let(:id_to_use) { other_user.id }
    let(:params) do
      super().merge(
        share: {
          users: [
            { id: other_user.id, permissions: permissions }
          ]
        }
      )
    end

    before do
      factory.add_user(entity: ve.entity, user: other_user)
    end

    it { is_expected.to have_http_status(:no_content) }

    it 'is expected to remove user from shared_with' do
      subject
      get :share_details, params: {id: ve.id}
      expect(json[:shared_with].size).to eq 0
      expect(json[:shareable_with].size).to eq 0
      expect(json[:shareable_with].first['contact_id']).to eq other_user.id
    end
  end
end
