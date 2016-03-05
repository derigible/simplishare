FactoryGirl.define do
  factory :account do
    name Faker::StarWars.droid

    factory :account_with_transaction_event do
      transient do
        transaction_events_count 1
      end

      after(:create) do |account, evaluator|
        create_list(:transaction_event, evaluator.transaction_events_count, accounts: [account])
      end
    end

    factory :account_with_transaction_events do
      transient do
        transaction_events_count 5
        Time.now
      end

      after(:create) do |account, evaluator|
        create_list(:transaction_event, evaluator.transaction_events_count, accounts: [account])
      end
    end
  end
end
