rand = Random.new

FactoryGirl.define do
  factory :event do
    description { Faker::Hipster.sentence }
    amount { rand.rand(1...500) }
    is_debit { rand.rand(2) ? true : false }
    notes { Faker::Hacker.say_something_smart }

    factory :event_with_account do
      transient do
        account { create(:account) }
      end

      after(:create) do |event, evaluator|
        event.accounts << evaluator.account
      end
    end

    factory :event_with_category do
      transient do
        category { create(:category) }
      end

      after(:create) do |event, evaluator|
        event.categories << evaluator.category
      end
    end
  end
end
