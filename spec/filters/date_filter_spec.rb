# frozen_string_literal: true

require 'spec_helper'

describe DateFilter do
  describe '#filter' do
    before do
      create_list(:event, 5)
    end
    let(:service) { described_class.new(params, Event) }

    context 'default' do
      let(:params) { {} }
      it 'returns all in the database' do
        expect(service.filter.count).to eq Event.count
      end

      context 'default as lookup_term' do
        let(:params) { { lookup_term: 'default', lookup_param: 1 } }
        it 'returns all in the database and is unaffected by lookup_param' do
          expect(service.filter.count).to eq Event.count
        end
      end
    end

    context 'day' do
      let(:params) { { lookup_term: 'day' } }

      before do
        create(:event, date: 7.days.ago)
        create(:event, date: 5.days.ago)
        create(:event, date: 4.days.ago)
        create(:event, date: 2.days.ago)
      end

      it 'returns all items created today' do
        expect(service.filter.count).to eq 5
        expect(service.filter.all { |item| item.date.to_date == Time.zone.today }.count).to eq 5
      end

      it 'does not return items created on other days' do
        expect(service.filter.any? { |item| item.date.to_date != Time.zone.today }).to be false
      end

      it 'is unaffected by lookup_param' do
        params[:lookup_param] = -1
        expect(service.filter.count).to eq 5
      end

      it 'does not return all items created in the database' do
        expect(service.filter.count).not_to eq Event.count
      end
    end

    context 'week' do
      let(:params) { { lookup_term: 'week' } }

      before do
        create(:event, date: 8.days.ago)
        create(:event, date: 6.days.ago)
        create(:event, date: 4.days.ago)
      end

      it 'returns all items created within last seven days' do
        expect(service.filter.count).to eq 7
        expect(service.filter.all { |item| item.date.to_date >= 7.days.ago }.count).to eq 7
      end

      it 'does not return items created before seven days ago' do
        expect(service.filter.any? { |item| item.date.to_date < 7.days.ago }).to be false
      end

      it 'is unaffected by lookup_param' do
        params[:lookup_param] = -1
        expect(service.filter.count).to eq 7
      end

      it 'does not return all items created in the database' do
        expect(service.filter.count).not_to eq Event.count
      end
    end

    context 'month' do
      before do
        create_list(:event, 2, created_at: 1.month.ago)
        if Time.zone.now.mday > 26
          create(:event, created_at: 6.days.ago)
          create(:event, created_at: 15.days.ago)
        elsif Time.zone.now.mday > 1
          create(:event, created_at: 1.day.ago)
          create(:event, created_at: 1.day.ago)
        else
          create(:event)
          create(:event)
        end
      end

      context 'current' do
        let(:params) { { lookup_term: 'month' } }

        xit 'returns all items created this month' do
          expect(service.filter.count).to eq 7
        end

        it 'does not return items created in other months' do
          expect(service.filter.any? { |item| item.date.month != Time.zone.now.month }).to be false
        end

        it 'does not return all items created in the database' do
          expect(service.filter.count).not_to eq Event.count
        end
      end

      # TODO: fix these tests (will break on first month of year)
      context 'given' do
        let(:params) { { lookup_term: 'month', lookup_param: 1.month.ago.month } }

        xit 'returns all items created in given month' do
          expect(service.filter.count).to eq 2
        end

        it 'does not return items created in other months' do
          expect(service.filter.any? { |item| item.date.month != 1.month.ago.month }).to be false
        end

        it 'does not return all items created in the database' do
          expect(service.filter.count).not_to eq Event.count
        end
      end

      context 'bad lookup_param' do
        let(:params) { { lookup_term: 'month' } }

        context 'raises InvalidLookupParamError' do
          # TODO: make this spec work anytime of the year (just being lazy)
          it 'with future month' do
            month = Time.zone.now.month + 1
            skip('December testing. Cannot test this until January') if month == 13
            params[:lookup_param] = month
            expect { service.filter }.to raise_error(BaseFilter::InvalidLookupParamError)
          end

          it 'with month <= 0' do
            params[:lookup_param] = 0
            expect { service.filter }.to raise_error(BaseFilter::InvalidLookupParamError)
          end

          it 'with month > 12' do
            params[:lookup_param] = 13
            expect { service.filter }.to raise_error(BaseFilter::InvalidLookupParamError)
          end
        end
      end
    end

    context 'year' do
      context 'current' do
        let(:params) { { lookup_term: 'year' } }

        it 'returns all items created this year'
        it 'does not return items created in other years'

        it 'does not return all items created in the database' do
          create(:event, date: 2.years.ago)
          expect(service.filter.count).not_to eq Event.count
        end
      end

      context 'given' do
        let(:params) { { lookup_term: 'year', lookup_param: 1.year.ago.year } }

        it 'returns all items created in given year'
        it 'does not return items created in other years'

        it 'does not return all items created in the database' do
          create(:event, date: 2.years.ago)
          expect(service.filter.count).not_to eq Event.count
        end
      end

      context 'bad lookup_param' do
        let(:params) { { lookup_term: 'year' } }

        context 'raises InvalidLookupParamError' do
          it 'with future year'
        end
      end
    end

    context 'invalid lookup_term' do
      let(:params) { { lookup_term: 'invalid' } }
      it 'raises InvalidLookupTermError' do
        expect { service.filter }.to raise_error(BaseFilter::InvalidLookupTermError)
      end
    end
  end
end
