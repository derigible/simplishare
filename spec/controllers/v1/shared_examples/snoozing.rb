# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a snoozable entity' do
  subject { post :snooze, params: params }

  let(:snooze_until) { 1.day.from_now.iso8601 }
  let(:params) { { id: ve.id, snooze: { snooze_until: snooze_until } } }
  let(:json_schema) { raise 'Override in spec' }
  let(:ve) { factory.virtual_object(overrides: { virtual_object: { user: user }.merge(overrides) }) }
  let(:factory) { raise 'Override in spec' }
  let(:overrides) { {} }

  it { is_expected.to have_http_status :ok }

  context 'removing the snooze_until' do
    let(:snooze_until) { nil }

    before do
      ve.update! snooze_until: 1.day.from_now
    end

    it { is_expected.to have_http_status :ok }

    it 'shows up in the unsnoozed list' do
      get :index
      expect(JSON.parse(response.body).size).to eq 0
      subject
      get :index
      expect(JSON.parse(response.body).size).to eq 1
    end
  end
end
