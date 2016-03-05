RSpec.configure do |config|
  # Need this to prevent the authenticate errors from occurring
  # http://stackoverflow.com/a/27941673/1228945
  config.include Devise::TestHelpers, type: :controller
end
