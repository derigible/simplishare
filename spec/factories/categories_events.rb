FactoryGirl.define do
  factory :categories_event do
    association :category
    association :event
  end
end
