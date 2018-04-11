FactoryGirl.define do
  factory :category do
    title { Faker::StarWars.droid }
    user { create :user }

    factory :category_with_event do
      transient do
        events_count 1
      end

      after(:create) do |category, evaluator|
        create_list(:event, evaluator.events_count, categories: [category])
      end
    end

    factory :category_with_events do
      transient do
        events_count 5
        Time.zone.now
      end

      after(:create) do |category, evaluator|
        create_list(:event, evaluator.events_count, categories: [category])
      end
    end
  end
end
