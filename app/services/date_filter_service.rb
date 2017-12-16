class DateFilterService
  class InvalidLookupTermError < StandardError
    def initialize(lookup_term)
      super("Invalid lookup_term provided: #{lookup_term} not found")
    end
  end
  class InvalidLookupParamError < StandardError
    def initialize(lookup_param)
      super("Invalid lookup_param provided: #{lookup_param} not valid")
    end
  end

  def initialize(params, scope)
    @params = params
    @scope = scope
  end

  # Method that takes the params and attempts to filter by the specified key.
  # If lookup is found and does not match a query method, an error will be
  # raised. If not found, the default will be used (currently model.all).
  # The `lookup_param` parameter should pass in query values as described below
  # Current lookup_terms available are:
  #
  #   day - all transactions on the given day in the current month and year
  #   week - all transaction for all days over the last seven days
  #   *NOTE: only for the current
  #
  #   month - all days in the given month in the current year
  #   quater - all days in the given quarter in the current year
  #   year - all days in the given year
  #   yearoveryear - all days of given month and all days of given month in previous year
  #   allmonths - all days of any year of the given month
  #   *NOTE: if the lookup_param parameter does not specify a value, then the
  #          call for the params above use the current value (day, month, or year)
  #   *NOTE: the lookup_param expects integer values for the above lookup_terms

  #   after_date - all transactions after the given date
  #   before_date - all transactions before the given date
  #   on_date - all transactions on the given date
  #   between_dates - all transactions between the given dates
  #                  * separate dates by a comma in the lookup_param parameter
  #   *NOTE: if the lookup_param is not specified, then an error is raised for
  #          the *_date(s) lookups
  def filter
    send("#{@params.fetch(:lookup_term, 'default')}_lookup")
  rescue NoMethodError, KeyError
    raise InvalidLookupTermError.new(@params[:lookup_term])
  end

  private

  attr_reader :scope

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

  # Lookups

  def default_lookup
    scope.all
  end

  def day_lookup
    scope.where('date >= ?', Time.zone.today)
  end

  def week_lookup
    scope.where('date >= ?', 7.days.ago)
  end

  def month_lookup
    month = @params.fetch(:lookup_param, now.month).to_i
    raise InvalidLookupParamError.new(month) if month > now.month || month <= 0
    scope.where('date >= ? and date <= ?', beginning_of_month(month), end_of_month(month))
  end

  def quarter_lookup
    quarter = @params.fetch(:lookup_param, current_quarter).to_i
    raise InvalidLookupParamError.new(quarter) if current_quarter < quarter || quarter <= 0
    scope.where('date >= ? and date <= ?', beginning_of_quarter(quarter), end_of_quarter(quarter))
  end
end
