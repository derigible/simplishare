# frozen_string_literal: true

desc "Seed data into an account. Defaults to 10 if count not specified."
task :todo_create, [:count, :user_id] => :environment do |_, args|
  count = args.fetch(:count, 10).to_i
  user_id = args.fetch(:user_id, 1)
  priorities = %w(low medium high)
  user = User.find user_id
  count.times do |i|
    t = Entity.create!(
      priority: priorities.sample(),
      data: {
        title: "Todo # #{i + 1}",
        description: i % 3 == 0 ? "A #{i + 1} description" : nil,
        todos: i % 5 == 0 ?
          (1..5).to_a.sample().times.map do |j|
            {
              id: SecureRandom.hex(10),
              priority: priorities.sample(),
              title: "Subtask for # #{j + 1}",
              description: j % 2 == 0 ? "A subtask #{j + 1} description" : nil
            }
          end :
          []
        }.compact,
        type: 'Todo'
    )
    VirtualEntity.create!(user: user, entity: t)
  end
end
