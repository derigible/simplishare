FactoryGirl.define do
  factory :events_category do
    association :category
    association :event
  end
end
