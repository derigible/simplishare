# frozen_string_literal: true

# to fix https://github.com/thoughtbot/factory_girl/issues/450
module ControllerMacros
  extend ActiveSupport::Concern

  included do
    let_once(:user) { create(:user) }
    let(:current_user) { user }

    let(:shard) do
      double(activate: true).tap do |shard_double|
        allow(shard_double).to receive(:activate).and_yield
      end
    end

    let(:json) { JSON.parse(response.body) }

    before do
      request.headers['Accept'] =
        "#{Mime[:json]}, application/vnd.pinkairship.v1"
      request.headers['Content-Type'] = Mime[:json].to_s
      allow(controller).to receive(:session).and_return('current_user_id' => current_user.id)
    end
  end

  def attributes_with_foreign_keys(*args)
    FactoryBot.create(*args).attributes.delete_if do |k, _|
      %w[id type created_at updated_at].member?(k)
    end
  end
end
