# frozen_string_literal: true

source 'https://rubygems.org'

gem 'active_model_serializers', '~> 0.10.6'
gem 'api-pagination'
gem "aws-sdk-s3", require: false

gem 'figaro', '~> 1.0.0'
gem 'health_check'
gem 'inst-jobs'
gem 'json_schemer'
gem 'omniauth'
gem 'omniauth-identity'
gem 'pagy'
gem 'pg', '~> 0.21.0'
gem 'pundit'
gem 'rack-cors', require: 'rack/cors'
gem 'rails', '~> 5.2.0'
gem 'responders' # Dry up controller responses
gem 'sanitize', '~> 4.0.1'
gem 'swagger-blocks', '~> 1.3.0' # API Documentation
gem 'versionist', '~> 1.4.1'

group :development, :test do
  gem 'byebug'
  gem 'faker', '~> 1.6.2' # Generate fake data for testing
  gem 'forgery'
  gem 'listen', '~> 3.1.5'
  gem 'rb-readline'
  gem 'rspec-rails'
end

group :test do
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'once-ler'
  gem 'rails-controller-testing'
  gem 'rubocop', require: false
  gem 'shoulda-matchers', '~> 3.1'
  gem 'simplecov', require: false
  gem 'timecop'
end

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# Added at 2018-06-27 23:32:06 -0600 by mphillips:
gem "json-jwt", "~> 1.9"
