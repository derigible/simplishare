require 'csv'

module Importers
  class CsvImporter < BaseImporter
    MINT_KEYS = ["Date", "Description", "Original Description", "Amount",
                 "Transaction Type", "Category", "Account Name", "Labels", "Notes"].freeze

    class MissingCsvKeysError < StandardError
      def initialize(msg = "Must contain keys #{MINT_KEYS}")
        super(msg)
      end
    end

    def import
      rows = rows_from_file(data)
      import_data(rows)
    end

    private

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
