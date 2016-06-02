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

  def initialize(params, model)
    @params = params
    @model = model
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

  def now
    @_now ||= Time.zone.now
  end

  def beginning_of_month(month, year = now.year)
    @_bom ||= Date.new(year, month, 1)
  end

  def end_of_month(month, year = now.year)
    @_eom ||= Date.new(year, month, -1)
  end

  # Lookups

  def default_lookup
    @model.all
  end

  def day_lookup
    @model.where('created_at >= ?', Time.zone.today)
  end

  def week_lookup
    @model.where('created_at >= ?', 7.days.ago)
  end

  def month_lookup
    month = @params.fetch(:lookup_param, now.month).to_i
    raise InvalidLookupParamError.new(month) if month > now.month || month <= 0
    @model.where('created_at >= ? and created_at <= ?', beginning_of_month(month), end_of_month(month))
  end
end
