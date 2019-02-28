# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity index action' do
  subject { get :index, params: params }

  let(:params) { {} }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  before do
    3.times.each { factory.entity overrides: { virtual_entity: { user: user } } }
  end

  it { is_expected.to have_http_status :ok }

  it 'returns correct number' do
    subject
    expect(json.size).to be(3)
  end

  context 'with other users' do
    let(:current_user) { create :user }

    before do
      2.times.each { factory.entity overrides: { virtual_entity: { user: current_user } } }
    end

    it 'returns correct number' do
      subject
      expect(json.size).to be(2)
    end
  end

  context 'with snoozed entity' do
    before do
      VirtualEntity.first.update! snooze_until: 1.day.from_now
    end

    it 'returns correct number' do
      subject
      expect(json.size).to be(2)
    end

    it 'returns correct number after snooze done' do
      subject
      Timecop.freeze(Time.zone.today + 2) do
        expect(json.size).to be(2)
      end
    end
  end

  it_behaves_like 'a paginated resource' do
    let(:create_entity_list) do
      ->(number) { number.times.each { factory.entity overrides: { virtual_entity: { user: user } } } }
    end
  end
end
