FactoryGirl.define do
  factory :accounts_event do
    association :account
    association :event
  end
end
