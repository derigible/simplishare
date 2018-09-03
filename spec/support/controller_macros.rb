# frozen_string_literal: true

# to fix https://github.com/thoughtbot/factory_girl/issues/450
module ControllerMacros
  extend ActiveSupport::Concern

  included do
    let(:current_user) do
      create(:user)
    end

    let(:shard) do
      double(activate: true).tap do |shard_double|
        allow(shard_double).to receive(:activate).and_yield
      end
    end

    let(:token) do
      double(
        acceptable?: true,
        current_user: current_user,
        scopes: [:api],
        shard: shard
      )
    end
    let(:json) { JSON.parse(response.body) }

    before do
      request.headers['Accept'] =
        "application/vnd.pinkairship.v1, #{Mime::JSON}"
      request.headers['Content-Type'] = Mime::JSON.to_s
    end
  end

  def attributes_with_foreign_keys(*args)
    FactoryGirl.create(*args).attributes.delete_if do |k, _|
      %w[id type created_at updated_at].member?(k)
    end
  end
end
