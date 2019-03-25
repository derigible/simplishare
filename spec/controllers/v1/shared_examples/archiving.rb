# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'an archivable entity' do
  let(:overrides) { {} }
  let(:ve) { factory.virtual_entity(overrides: { virtual_entity: { user: user }.merge(overrides) }) }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }
  let(:update_shared) { raise 'Override in spec' }

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
          factory.add_user(entity: VirtualEntity.first.entity, user: current_user)
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

  describe 'archive' do
    subject { put :archive, params: params.merge(update_shared), as: :json }

    let(:params) { { id: ve.id } }

    context 'when only user' do
      it 'archives virtual_entity only' do
        expect(ve.archived).to be nil
        subject
        expect(ve.reload.archived).to eq true
        expect(ve.entity.archived).to be_nil
      end

      it 'does not send email'
    end

    context 'when shared' do
      context 'when not owner and archive privileges denied' do
        let(:current_user) { create :user }

        before do
          factory.add_user(entity: ve.entity, user: current_user)
        end

        it { is_expected.to have_http_status(:forbidden) }

        it 'does not send email'
      end

      shared_examples_for 'can archive' do
        it { is_expected.to have_http_status :ok }

        it 'archives the virtual_entity' do
          expect(ve.archived).to be nil
          subject
          expect(ve.reload.archived).to eq true
          expect(ve.entity.archived).to be_nil
        end

        context 'when update_shared is true' do
          let(:update_shared) { super().merge(super().keys.first => { archived: true, update_shared: true } ) }

          it 'archives the entity' do
            expect(ve.entity.archived).to be nil
            subject
            expect(ve.reload.archived).to be nil
            expect(ve.entity.archived).to eq true
          end

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
