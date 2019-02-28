# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    title { Faker::StarWars.droid }
    user { create :user }
  end
end
