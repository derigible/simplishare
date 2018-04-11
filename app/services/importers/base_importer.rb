require 'date'

module Importers
  class BaseImporter
    attr_reader :user, :data, :accounts_hash, :categories_hash, :events_hash

    def initialize(user, data)
      @user = user
      @data = data
      @accounts_hash = {}
      @categories_hash = {}
      @events_hash = {}
    end

    def import_data(data)
      accounts_and_categories_and_events
      # fail all create if error with creation
      ActiveRecord::Base.transaction do
        data.map do |row|
          record = create_record_hash(row)
          create_event_and_associations(record, row['Account Name'], row['Category'])
        end
      end
    end

    private

    def dedupe_data(data)
      data.each_with_object({}) do |datum, hash|
        hash[datum.hash] = datum
      end.values
    end

    def create_record_hash(row)
      {
        description: row['Original Description'],
        amount: row['Amount'],
        is_debit: row['Transaction Type'] == 'debit',
        notes: "#{row['Notes']} | Labels: #{row['Labels']}",
        date: get_date(row)
      }
    end

    def accounts_and_categories_and_events
      AccountPolicy::Scope.new(user, Account).resolve.map { |account| @accounts_hash[account.name] = account }
      CategoryPolicy::Scope.new(user, Category).resolve.map { |category| @categories_hash[category.title] = category }
      EventPolicy::Scope.new(user, Event).resolve.includes(:accounts, :categories).map do |event|
        @events_hash[event_hash_key(event)] = event
      end
    end

    def event_hash_key(event)
      "#{event.date.year}#{event.date.month}#{event.date.day}#{event.amount}" \
        "#{event.is_debit}#{event.description.slice(0, 5)}"
    end

    def record_hash_key(record)
      "#{record[:date].year}#{record[:date].month}#{record[:date].day}#{record[:amount]}" \
        "#{record[:is_debit]}#{record[:description].slice(0, 5)}"
    end

    def create_event_and_associations(record, account_name, category)
      account = get_or_create_account(account_name)
      category = get_or_create_category(category)
      create_linked_event(record, account, category)
    end

    def get_date(record)
      Date.strptime(record['Date'], '%m/%d/%Y')
    end

    def get_or_create_account(name)
      if accounts_hash.include?(name)
        accounts_hash[name]
      else
        account = Account.create!(name: name, user: user)
        accounts_hash[name] = account
        account
      end
    end

    def get_or_create_category(title)
      if categories_hash.include?(title)
        categories_hash[title]
      else
        category = Category.create!(title: title, user: user)
        categories_hash[title] = category
        category
      end
    end

    def create_linked_event(record, account, category)
      return if event_exists?(record, account, category)
      event = Event.create!(user: user, **record)
      create_account_and_category_link(event, account, category)
    end

    def create_account_and_category_link(event, account, category)
      EventsAccount.create!(event: event, account: account)
      EventsCategory.create!(event: event, category: category)
      event
    end

    def event_exists?(record, account, category)
      event = events_hash[record_hash_key(record)] || Event.find_by(user: user, **record)

      return false if event.nil?
      return true if event.accounts.include?(account) && event.categories.include?(category)
    end
  end
end
