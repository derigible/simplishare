class DateFilter < BaseFilter
  # The `lookup_term` parameter should pass in query values as described below
  # Current lookup_terms available are:
  #
  #   month - all days in the given month in the current year
  #   quater - all days in the given quarter in the current year
  #   year - all days in the given year
  #   *NOTE: if the lookup_param parameter does not specify a value, then the
  #          call for the params above use the current value (day, month, or year)
  #   *NOTE: the lookup_param expects integer values for the above lookup_terms
  #
  #   on_date - all transactions on the given date
  #   between_dates - all transactions between the given dates
  #                  * separate dates by a comma in the lookup_param parameter
  #   *NOTE: if the lookup_param is not specified, then an error is raised for
  #          the *_date(s) lookups

  private

  def now
    @_now ||= Time.zone.now
  end

  def beginning_of_month(month, year = now.year)
    @_bom ||= Date.new(year, month, 1)
  end

  def end_of_month(month, year = now.year)
    @_eom ||= Date.new(year, month, -1)
  end

  def beginning_of_quarter(quarter, year = now.year)
    @_boqm ||= begin
      start_of_quarter_month = quarter == 1 ? 1 : ((quarter - 1) * 3) + 1
      Date.new(year, start_of_quarter_month, 1)
    end
  end

  def end_of_quarter(quarter, year = now.year)
    @_eoqm ||= begin
      end_of_quarter_month = quarter == 1 ? 3 : ((quarter - 1) * 3) + 3
      Date.new(year, end_of_quarter_month, -1)
    end
  end

  def current_quarter
    @_quarter ||= now.month / 3
  end

  def beginning_of_year(year = now.year)
    @_boym ||= begin
      Date.new(year, 1, 1)
    end
  end

  def end_of_year(year = now.year)
    @_eoym ||= begin
      Date.new(year, 12, 31)
    end
  end

  def current_year
    @_year ||= now.year
  end

  # Lookups

  def day_lookup
    scope.where('date >= ?', Time.zone.today)
  end

  def week_lookup
    scope.where('date >= ?', 7.days.ago)
  end

  def month_lookup
    month = @params.fetch(:lookup_param, now.month).to_i
    raise BaseFilter::InvalidLookupParamError.new(month) if month > now.month || month <= 0
    scope.where('date >= ? and date <= ?', beginning_of_month(month), end_of_month(month))
  end

  def quarter_lookup
    quarter = @params.fetch(:lookup_param, current_quarter).to_i
    raise BaseFilter::InvalidLookupParamError.new(quarter) if current_quarter < quarter || quarter <= 0
    scope.where('date >= ? and date <= ?', beginning_of_quarter(quarter), end_of_quarter(quarter))
  end

  def year_lookup
    year = @params.fetch(:lookup_param, current_year).to_i
    raise BaseFilter::InvalidLookupParamError.new(year) if current_year < year
    scope.where('date >= ? and date <= ?', beginning_of_year(year), end_of_year(year))
  end
end
