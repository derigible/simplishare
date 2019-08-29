# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'an archivable entity' do
  let(:overrides) { {} }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }
  let(:update_shared) { raise 'Override in spec' }

  describe 'index' do
    subject { get :index, params: params }

    let(:params) { {} }

    before :once do
      3.times.each { factory.entity overrides: { virtual_object: { user: user } } }
    end

    context 'with archived entity' do
      before :once do
        Entity.first.update! archived: true
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
      before :once do
        VirtualEntity.first.update! archived: true
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

    let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
    let(:id_to_use) { ve.id }
    let(:params) { { id: id_to_use } }

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
        let(:ve_to_check) { raise 'Override in spec' }

        it { is_expected.to have_http_status :ok }

        it 'archives the virtual_entity' do
          expect(ve_to_check.archived).to be nil
          subject
          expect(ve_to_check.reload.archived).to eq true
          expect(ve_to_check.entity.archived).to be_nil
        end

        context 'when update_shared is true' do
          let(:update_shared) { super().merge(super().keys.first => { archived: true, update_shared: true } ) }

          it 'archives the entity' do
            expect(ve_to_check.entity.archived).to be nil
            subject
            expect(ve_to_check.reload.archived).to be nil
            expect(ve_to_check.entity.archived).to eq true
          end

          it 'sends an email to all users'
        end
      end

      context 'when owner' do
        it_behaves_like 'can archive' do
          let(:ve_to_check) { ve }
        end
      end

      context 'when archive privileges granted' do
        let(:current_user) { create :user }
        let(:overrides) do
          {
            metadata: {
              permissions: %w[edit archive]
            }
          }
        end
        let(:current_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
        let(:id_to_use) { current_ve.id }

        it_behaves_like 'can archive' do
          let(:ve_to_check) { current_ve }
        end
      end
    end
  end

  describe 'unarchive' do
    subject { delete :archive, params: params.merge(update_shared), as: :json }

    let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
    let(:id_to_use) { ve.id }
    let(:params) { { id: id_to_use } }

    context 'when only user' do
      it 'unarchives virtual_entity only' do
        expect(ve.archived).to be nil
        subject
        expect(ve.reload.archived).to eq false
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
        let(:ve_to_check) { raise 'Override in spec' }

        it { is_expected.to have_http_status :ok }

        it 'archives the virtual_entity' do
          expect(ve_to_check.archived).to be nil
          subject
          expect(ve_to_check.reload.archived).to eq false
          expect(ve_to_check.entity.archived).to be_nil
        end

        context 'when update_shared is true' do
          let(:update_shared) { super().merge(super().keys.first => { archived: false, update_shared: true } ) }

          it 'archives the entity' do
            expect(ve_to_check.entity.archived).to be nil
            subject
            expect(ve_to_check.reload.archived).to be nil
            expect(ve_to_check.entity.archived).to eq false
          end

          it 'sends an email to all users'
        end
      end

      context 'when owner' do
        it_behaves_like 'can archive' do
          let(:ve_to_check) { ve }
        end
      end

      context 'when archive privileges granted' do
        let(:current_user) { create :user }
        let(:overrides) do
          {
            metadata: {
              permissions: %w[edit archive]
            }
          }
        end
        let(:current_ve) { factory.add_user(entity: ve.entity, user: current_user, overrides: overrides) }
        let(:id_to_use) { current_ve.id }

        it_behaves_like 'can archive' do
          let(:ve_to_check) { current_ve }
        end
      end
    end
  end
end
