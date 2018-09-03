# frozen_string_literal: true

FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "person_#{n}@example.com" }
    full_name { Faker::Hipster.word }

    after(:build) do |user|
      user.password = '12345678'
    end
  end
end
