ApiPagination.configure do |config|
  # If you have more than one gem included, you can choose a paginator.
  # config.paginator = :pagy
end

module ApiPagination
  class << self
    # because the count lookup using :all will be wrong and there is no way to customize how that lookup
    # should behave in ApiPagination 4.8.1
    def pagy_from(collection, options)
      if options[:count]
        count = options[:count]
      else
        count = collection.is_a?(Array) ? collection.count : collection.count(:id)
      end

      Pagy.new(count: count, items: options[:per_page], page: options[:page])
    end
  end
end
