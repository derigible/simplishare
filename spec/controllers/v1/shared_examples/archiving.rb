# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'an archivable entity' do
  describe 'index' do
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
    context 'when only user' do
      it 'archives virtual_entity only'

      it 'does not send email'
    end

    context 'when shared' do
      context 'when not owner or archive privileges denied' do
        it { is_expected.to have_http_status(:forbidden) }

        it 'does not send email'
      end

      shared_examples_for 'can archive' do
        it { is_expected.to have_http_status :ok }

        it 'archives the virtual_entity'

        context 'when update_shared is true' do
          it 'archives the entity'

          it ''
        end
      end

      context 'when owner' do

      end
      context 'when archive privileges granted'
    end
  end
end
