FactoryGirl.define do
  factory :accounts_transaction_event do
    association :account
    association :transaction_event
  end
end
