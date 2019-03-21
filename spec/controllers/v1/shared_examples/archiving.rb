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
      before do
        Entity.first.archive!
      end

      it 'does not send archived entities' do
        subject
        expect(json.size).to eq 2
        expect(json.map { |e| e['shared_object_id'] }).to match_array(Entity.unarchived.pluck(:id).map(&:to_s))
      end

      context 'when archived param sent' do
        let(:params) { { archived: true } }

        it 'only sends archived entities' do
          subject
          expect(json.size).to eq 1
          expect(json.first['shared_object_id']).to eq Entity.archived.first.id.to_s
        end
      end
    end

    context 'with archived virtual_entity' do
      before do
        VirtualEntity.first.archive!
      end

      it 'does not send archived virtual_entities' do
        subject
        expect(json.size).to eq 2
        expect(json.map { |e| e['id'] }).to match_array(VirtualEntity.unarchived.pluck(:id).map(&:to_s))
      end

      context 'with shared user on entity' do
        let(:current_user) { create(:user) }

        before do
          VirtualEntity.create! user: current_user, entity: VirtualEntity.first.entity
        end

        it 'remains visible for other user' do
          subject
          expect(json.size).to eq 1
          expect(json.first['shared_object_id']).to eq VirtualEntity.first.entity.id.to_s
        end
      end

      context 'when archived param sent' do
        let(:params) { { archived: true } }

        it 'only sends archived virtual_entities' do
          subject
          expect(json.size).to eq 1
          expect(json.first['id']).to eq VirtualEntity.archived.first.id.to_s
        end
      end
    end
  end

  xdescribe 'archive' do
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
        it_behaves_like 'can archive'
      end

      context 'when archive privileges granted' do
        it_behaves_like 'can archive'
      end
    end
  end
end
