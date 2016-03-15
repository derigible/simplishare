FactoryGirl.define do
  factory :category do
    title { Faker::StarWars.droid }
  end
end
