# frozen_string_literal: true

FactoryBot.define do
  factory :account do
    name { Faker::StarWars.droid }
    user { create :user }
  end
end
