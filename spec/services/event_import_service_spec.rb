require 'spec_helper'

describe EventImportService do
  describe '.import_csv' do
    let(:user) { create :user }

    context 'with mint-like csv' do
      before :all do
        csv_file = open(Rails.root.join('spec', 'fixtures', 'events_mint.csv'))
        @csv_data = csv_file.read
      end

      it 'creates events' do
        expect { EventImportService.import_csv(user, @csv_data) }.to change { Event.count }.by 10
      end

      it 'creates accounts' do
        expect { EventImportService.import_csv(user, @csv_data) }.to change { Account.count }.by 2
      end

      it 'creates categories' do
        expect { EventImportService.import_csv(user, @csv_data) }.to change { Category.count }.by 10
      end

      it 'creates events_accounts' do
        expect { EventImportService.import_csv(user, @csv_data) }.to change { EventsAccount.count }.by 10
      end

      it 'creates events_categories' do
        expect { EventImportService.import_csv(user, @csv_data) }.to change { EventsCategory.count }.by 10
      end

      context 'with same file upload' do
        it 'does not recreate events if duplicate' do
          EventImportService.import_csv(user, @csv_data)
          expect { EventImportService.import_csv(user, @csv_data) }.to change { EventsCategory.count }.by 0
        end
      end
    end

    context 'with non-mint-like csv' do
      before :all do
        csv_file = open(Rails.root.join('spec', 'fixtures', 'events.csv'))
        @csv_data = csv_file.read
      end

      it 'raises an error' do
        expect { EventImportService.import_csv(user, @csv_data) }.to raise_error EventImportService::MissingCsvKeysError
      end
    end
  end
end
