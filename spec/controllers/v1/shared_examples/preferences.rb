# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'an entity with preferences' do
  subject { put :preferences, params: params }

  let(:record_type) { raise 'Override in spec' }
  let(:action) { 'update' }
  let(:preference_type) { 'email' }
  let(:preference) { 'always' }
  let(:id_to_use) { ve.id }
  let(:params) do
    {
      id: id_to_use,
      preference: {
        record_type: record_type,
        action: action,
        preference_type: preference_type,
        preference: preference
      }
    }
  end
  let(:json_schema) { raise 'Override in spec' }
  let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
  let(:factory) { raise 'Override in spec' }
  let(:overrides) { {} }

  it { is_expected.to have_http_status :ok }

  it 'renders expected json' do
    subject
    expect(json.dig('preferences', 'email', record_type, 'update')).to eq 'always'
  end

  context 'when not virtual owner' do
    let(:current_user) { create :user}

    it { is_expected.to have_http_status :forbidden }
  end
end
