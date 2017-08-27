module EventImportService
  MINT_KEYS = ["Date", "Description", "Original Description", "Amount",
               "Transaction Type", "Category", "Account Name", "Labels", "Notes"].freeze

  class MissingCsvKeysError < StandardError
    def initialize(msg = "Must contain keys #{MINT_KEYS}")
      super(msg)
    end
  end

  class << self
    def import_csv(user, csv_data)
      Importers::CsvImporter.new(user, csv_data).import
    end
  end
end
