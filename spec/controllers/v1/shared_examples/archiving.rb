# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'an archivable entity' do
  let(:overrides) { {} }
  let(:ve) { factory.entity overrides: { virtual_entity: { user: user }.merge(overrides) } }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  describe 'index' do
    subject { get :index, params: params }

    let(:params) { {} }

    before do
      3.times.each { factory.entity overrides: { virtual_entity: { user: user } } }
    end

    context 'with archived entity' do
      it 'does not send archived entities'

      context 'when archived param sent' do
        it 'only sends archived entities'
      end
    end

    context 'with archived virtual_entity' do
      it 'does not send archived virtual_entities'

      it 'does not affect shared users of entity'

      context 'when archived param sent' do
        it 'only sends archived virtual_entities'
      end
    end
  end

  describe 'update' do
    subject { put :archive, params: params.merge(update_shared), as: :json }

    let(:params) { { id: ve.id } }
    let(:update_shared) { {} }

    context 'when only user' do
      it 'archives virtual_entity only'

      it 'does not send email'
    end

    context 'when shared' do
      context 'when not owner and archive privileges denied' do
        it { is_expected.to have_http_status(:forbidden) }

        it 'does not send email'
      end

      shared_examples_for 'can archive' do
        it { is_expected.to have_http_status :ok }

        it 'archives the virtual_entity'

        context 'when update_shared is true' do
          let(:update_shared) { { update_shared: true } }

          it 'archives the entity'

          it 'removes from all users index'

          it 'sends an email to all users'
        end
      end

      context 'when owner' do
        it_behaves_like 'can_archive'
      end

      context 'when archive privileges granted' do
        it_behaves_like 'can_archive'
      end
    end
  end
end
