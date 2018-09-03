# frozen_string_literal: true

FactoryGirl.define do
  factory :account do
    name { Faker::StarWars.droid }
    user { create :user }

    factory :account_with_event do
      transient do
        events_count 1
      end

      after(:create) do |account, evaluator|
        create_list(:event, evaluator.events_count, accounts: [account])
      end
    end

    factory :account_with_events do
      transient do
        events_count 5
        Time.zone.now
      end

      after(:create) do |account, evaluator|
        create_list(:event, evaluator.events_count, accounts: [account])
      end
    end
  end
end
