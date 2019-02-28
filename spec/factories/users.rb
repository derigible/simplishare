# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "person_#{n}@example.com" }
    sequence(:username) { |n| "person_#{n}" }
    full_name { Faker::Hipster.word }

    after(:build) do |user|
      user.password = '12345678'
    end
  end
end
