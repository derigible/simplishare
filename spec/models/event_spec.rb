require 'spec_helper'

describe Event do
  describe 'associations' do
    it do
      is_expected.to have_many(:events_accounts).dependent(:delete_all)
        .autosave(true).inverse_of(:event)
    end

    it do
      is_expected.to have_many(:events_categories).dependent(:delete_all)
        .autosave(true).inverse_of(:event)
    end

    it { is_expected.to have_many(:categories).through(:events_categories) }
    it { is_expected.to have_many(:accounts).through(:events_accounts) }
  end

  describe '.import_csv' do
    context 'with mint-like csv' do
      before :all do
        csv_file = open(File.expand_path("../../fixtures/events_mint.csv", __FILE__))
        @csv_data = csv_file.read
      end

      it 'creates events' do
        expect { Event.import_csv(@csv_data) }.to change { Event.count }.by 10
      end

      it 'creates accounts' do
        expect { Event.import_csv(@csv_data) }.to change { Account.count }.by 2
      end

      it 'creates categories' do
        expect { Event.import_csv(@csv_data) }.to change { Category.count }.by 10
      end

      it 'creates events_accounts' do
        expect { Event.import_csv(@csv_data) }.to change { EventsAccount.count }.by 10
      end

      it 'creates events_categories' do
        expect { Event.import_csv(@csv_data) }.to change { EventsCategory.count }.by 10
      end
    end

    context 'with non-mint-like csv' do
      before :all do
        csv_file = open(File.expand_path("../../fixtures/events.csv", __FILE__))
        @csv_data = csv_file.read
      end

      it 'raises an error' do
        err_msg = 'must contain keys ["Date", "Description", "Original Description", "Amount", "Transaction Type", '\
                  '"Category", "Account Name", "Labels", "Notes"]'
        expect { Event.import_csv(@csv_data) }.to raise_error(err_msg)
      end
    end
  end
end
