# frozen_string_literal: true

rand = Random.new

FactoryBot.define do
  factory :event do
    description { Faker::Hipster.sentence }
    amount { rand.rand(1...500) }
    is_debit { rand.rand(2) ? true : false }
    notes { Faker::Hacker.say_something_smart }
    user { create :user }
    date { Time.zone.now }
  end
end
