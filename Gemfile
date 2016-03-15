source 'https://rubygems.org'

gem 'active_model_serializers', '~> 0.10.0.rc4'
gem 'api-pagination', '~> 3.1.0'
gem 'devise', '~> 3.5.2'
gem 'doorkeeper', '~> 3.0.1'  # OAuth
gem 'figaro', '~> 1.0.0'
gem 'gon', '~> 6.0.1'
gem 'kaminari', '~> 0.16.1' # Paging
gem 'pg', '~> 0.17.1'
gem 'rails', '4.2.4'
gem 'rails_admin'
gem 'responders' # Dry up controller responses
gem 'rolify', '~> 5.0.0'  # Roles
gem 'sass-rails', '~> 4.0.2' # Use SCSS for stylesheets
gem 'seedbank', '~> 0.3.0' # Used for seeding different environments
gem 'swagger-blocks', '~> 1.3.0' # API Documentation
gem 'health_check'
gem 'versionist', '~> 1.4.1'

group :development, :test do
  gem 'railroady', '~> 1.2.0' # This is for generating the data model image
  gem 'ruby-graphviz', '~> 1.2.1' # Provide dot and neato commands for railroady
  gem 'faker', '~> 1.6.2' # Generate fake data for testing
  gem 'forgery'
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'byebug'
end

group :test do
  gem 'rubocop', require: false
  gem 'simplecov', require: false
end

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end
