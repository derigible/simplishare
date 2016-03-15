rand = Random.new

FactoryGirl.define do
  factory :transaction_event do
    description { Faker::Hipster.sentence }
    amount { rand.rand(1...500) }
    is_debit { rand.rand(2) ? true : false }
    notes { Faker::Hacker.say_something_smart }
  end
end
