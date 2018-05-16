class BaseFilter
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
  # raised. If not found, the passed in scope will be used.
  def filter
    send("#{@params.fetch(:lookup_term, 'default')}_lookup")
  rescue NoMethodError, KeyError
    raise BaseFilter::InvalidLookupTermError.new(@params[:lookup_term])
  end

  private

  attr_reader :scope

  def default_lookup
    scope.all
  end
end
