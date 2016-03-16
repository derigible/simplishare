FactoryGirl.define do
  factory :events_account do
    association :account
    association :event
  end
end
