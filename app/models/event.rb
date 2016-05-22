class Event < ActiveRecord::Base
  has_many :events_accounts, dependent: :delete_all, autosave: true, inverse_of: :event
  has_many :accounts, through: :events_accounts

  has_many :events_categories, dependent: :delete_all, autosave: :true, inverse_of: :event
  has_many :categories, through: :events_categories

  MINT_KEYS = ["Date", "Description", "Original Description", "Amount",
               "Transaction Type", "Category", "Account Name", "Labels", "Notes"].freeze

  class MissingCsvKeysError < StandardError
    def initialize(msg = "Must contain keys #{MINT_KEYS}")
      super(msg)
    end
  end

  class << self
    def import_csv(csv_data)
      rows = rows_from_file(csv_data)
      accounts_hash = {}
      Account.all.map { |account| accounts_hash[account.name] = account }
      categories_hash = {}
      Category.all.map { |category| categories_hash[category.title] = category }

      # fail all create if error with creation
      transaction do
        rows.map do |row|
          create_event_and_associations(accounts_hash, categories_hash, row)
        end
      end
    end

    private

    def create_event_and_associations(accounts_hash, categories_hash, row)
      account = get_or_create_account(row['Account Name'], accounts_hash)
      category = get_or_create_category(row['Category'], categories_hash)
      event = Event.create!(description: row['Original Description'],
                            amount: row['Amount'],
                            is_debit: row['Transaction Type'] == 'debit',
                            notes: "#{row['Notes']} | Labels: #{row['Labels']}",
                            created_at: row['Date'])
      EventsAccount.create!(account: account, event: event)
      EventsCategory.create!(category: category, event: event)
      event
    end

    def get_or_create_account(name, accounts_hash)
      if accounts_hash.include?(name)
        accounts_hash[name]
      else
        account = Account.create!(name: name)
        accounts_hash[name] = account
        account
      end
    end

    def get_or_create_category(title, categories_hash)
      if categories_hash.include?(title)
        categories_hash[title]
      else
        category = Category.create!(title: title)
        categories_hash[title] = category
        category
      end
    end

    def rows_from_file(csv_data)
      raise MissingCsvKeysError unless like_mint_csv?(csv_data)
      CSV.new(csv_data, headers: true)
    end

    def like_mint_csv?(csv_data)
      headers = CSV.parse_line(csv_data)
      (MINT_KEYS - headers).empty?
    end
  end
end
