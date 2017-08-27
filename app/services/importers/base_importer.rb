require 'date'

module Importers
  class BaseImporter
    attr_reader :user, :data, :accounts_hash, :categories_hash

    def initialize(user, data)
      @user = user
      @data = data
      @accounts_hash = {}
      @categories_hash = {}
    end

    def import_data(data)
      accounts_and_categories
      # fail all create if error with creation
      ActiveRecord::Base.transaction do
        data.map do |row|
          create_event_and_associations(accounts_hash, categories_hash, row)
        end
      end
    end

    private

    def accounts_and_categories
      AccountPolicy::Scope.new(user, Account).resolve.map { |account| @accounts_hash[account.name] = account }
      CategoryPolicy::Scope.new(user, Category).resolve.map { |category| @categories_hash[category.title] = category }
    end

    def create_event_and_associations(accounts_hash, categories_hash, record_data)
      account = get_or_create_account(record_data['Account Name'], accounts_hash)
      category = get_or_create_category(record_data['Category'], categories_hash)
      create_linked_event(record_data, account, category)
    end

    def get_date(record_data)
      Date.strptime(record_data['Date'], '%m/%d/%Y')
    end

    def get_or_create_account(name, accounts_hash)
      if accounts_hash.include?(name)
        accounts_hash[name]
      else
        account = Account.create!(name: name, user: user)
        accounts_hash[name] = account
        account
      end
    end

    def get_or_create_category(title, categories_hash)
      if categories_hash.include?(title)
        categories_hash[title]
      else
        category = Category.create!(title: title, user: user)
        categories_hash[title] = category
        category
      end
    end

    def create_linked_event(record_data, account, category)
      event = Event.create!(description: record_data['Original Description'],
                            amount: record_data['Amount'],
                            is_debit: record_data['Transaction Type'] == 'debit',
                            notes: "#{record_data['Notes']} | Labels: #{record_data['Labels']}",
                            date: get_date(record_data),
                            user: user)
      EventsAccount.create!(account: account, event: event)
      EventsCategory.create!(category: category, event: event)
      event
    end
  end
end
