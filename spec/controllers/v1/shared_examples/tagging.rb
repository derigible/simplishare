# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity tag action' do
  let(:params) { { id: id_to_use, tag_ids: tag_ids } }
  let(:id_to_use) { ve.id }
  let(:tag_ids) { tags.map(&:id) }
  let(:tags) { [tag] }
  let(:tag_factory) { Factories::TagFactory }
  let(:tag) { tag_factory.virtual_object overrides: { virtual_object: { user: current_user } } }
  let(:ve) do
    factory.virtual_object(overrides: { virtual_object: { user: user, entity_owner: true } })
  end
  let(:factory) { raise 'Override in spec' }
  let(:json_schema) { Schemas::Tag }

  describe 'tag' do
    subject { post :tag, params: params }

    it { is_expected.to have_http_status :ok }

    it 'renders expected json' do
      subject
      expect(json_schema.simple_validation_errors(json['tags'].first)).to be_blank
    end

    context 'when tagging with a tag already attached' do
      let(:tags) do
        ts = []
        2.times { ts << tag_factory.virtual_object(overrides: { virtual_object: { user: current_user } }) }
        ts
      end

      before do
        ve.virtual_tags << tags.first
      end

      it 'only adds tags not already tagged' do
        before_tags = ve.virtual_tag_ids.map(&:to_s)
        subject
        expect(json['tags'].map { |vt| vt['id'] } - before_tags).to match_array([tags.second.id.to_s])
      end
    end

    context 'when tagging with an invalid tag' do
      let(:tags) do
        ts = []
        2.times { ts << tag_factory.virtual_object(overrides: { virtual_object: { user: current_user } }) }
        ts
      end
      let(:tag_ids) { super() + [0] }

      before do
        ve.virtual_tags << tags.first
      end

      it 'only adds tags not already tagged' do
        before_tags = ve.virtual_tag_ids.map(&:to_s)
        subject
        expect(json['tags'].map { |vt| vt['id'] } - before_tags).to match_array([tags.second.id.to_s])
      end

      context 'because tag owned by other user' do
        let(:other_user) { create :user }
        let(:other_ve) { factory.virtual_object(overrides: { virtual_object: { user: other_user } }) }
        let(:other_user_tag) do
          tag_factory.virtual_object(overrides: { virtual_object: { user: other_user } })
        end
        let(:tag_ids) { super() + [other_user_tag.id] }

        it 'raise forbidden error' do
          subject
          expect(response).to have_http_status :forbidden
        end
      end
    end
  end

  describe 'untag' do
    subject { delete :untag, params: params }

    let(:tags) do
      ts = []
      2.times { ts << tag_factory.virtual_object(overrides: { virtual_object: { user: current_user } }) }
      ts
    end
    let(:tag_ids) { [tags.first.id] }

    before do
      ve.virtual_tags << tags
    end

    it { is_expected.to have_http_status :ok }

    it 'renders expected json' do
      subject
      expect(json_schema.simple_validation_errors(json['tags'].first)).to be_blank
    end

    it 'has removed the deleted tag' do
      expect(ve.virtual_tags.size).to eq 2
      subject
      expect(json['tags'].size).to eq 1
      expect(json['tags'].first['id']).to eq tags.second.id.to_s
    end

    context 'when untagging with an invalid tag' do
      let(:tag_ids) { super() + [0] }

      it 'only removes tags already tagged' do
        before_tags = ve.virtual_tag_ids.map(&:to_s)
        subject
        expect(before_tags - json['tags'].map { |vt| vt['id'] }).to match_array([tags.first.id.to_s])
      end

      context 'because tag owned by other user' do
        let(:other_user) { create :user }
        let(:other_ve) { factory.virtual_object(overrides: { virtual_object: { user: other_user } }) }
        let(:other_user_tag) do
          tag_factory.virtual_object(overrides: { virtual_object: { user: other_user } })
        end
        let(:tag_ids) { super() + [other_user_tag.id] }

        it 'raise forbidden error' do
          subject
          expect(response).to have_http_status :forbidden
        end
      end
    end
  end
end
