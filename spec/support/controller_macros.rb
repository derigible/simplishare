# to fix https://github.com/thoughtbot/factory_girl/issues/450
module ControllerMacros
  def attributes_with_foreign_keys(*args)
    FactoryGirl.create(*args).attributes.delete_if do |k, _|
      %w(id, type, created_at, updated_at).member?(k)
    end
  end
end
