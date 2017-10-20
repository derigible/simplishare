# to fix https://github.com/thoughtbot/factory_girl/issues/450
module ControllerMacros
  extend ActiveSupport::Concern

  included do
    let(:current_resource_owner) do
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
        current_resource_owner: current_resource_owner,
        scopes: [:api],
        shard: shard
      )
    end
    let(:json) { JSON.parse(response.body) }

    before do
      allow(controller).to receive(:doorkeeper_token) { token }
      request.headers['Accept'] =
        "application/vnd.budgetr.v1, #{Mime::JSON}"
      request.headers['Content-Type'] = Mime::JSON.to_s
    end
  end

  def attributes_with_foreign_keys(*args)
    FactoryGirl.create(*args).attributes.delete_if do |k, _|
      %w(id, type, created_at, updated_at).member?(k)
    end
  end
end
