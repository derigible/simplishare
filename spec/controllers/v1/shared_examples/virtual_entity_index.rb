# frozen_string_literal: true

require 'spec_helper'

shared_examples_for 'a virtual_entity index action' do
  let(:params) { {} }
  let(:json_schema) { raise 'Override in spec' }
  let(:factory) { raise 'Override in spec' }

  before :once do
    3.times.each { factory.entity overrides: { virtual_object: { user: user } } }
  end

  it_behaves_like 'a virtual_objects index action'

  context 'with snoozed items' do
    subject { get :index, params: params }

    before do
      VirtualEntity.first.update! snooze_until: 1.day.from_now
    end

    after do
      VirtualEntity.first.update! snooze_until: nil
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
end
