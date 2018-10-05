# frozen_string_literal: true

module Delegates
  class JwtVerifier
    attr_reader :errors

    def initialize(jwt)
      @jwt = jwt
      @errors = []
    end

    def verify_jwt
      verify_iss(@jwt)
      verify_sub(@jwt)
      verify_issued_at(@jwt)
      verify_expiration(@jwt)
      errors.empty?
    end

    private

    def verify_iss(jwt)
      errors << 'Iss does not match pinkairship' unless jwt[:iss] == 'pinkairship'
    end

    def verify_sub(jwt)
      errors << 'Subject not present' if jwt[:sub].blank?
    end

    def verify_issued_at(jwt)
      lower_bound = issued_at_lower_bound
      return if Time.zone.at(jwt[:iat]).between?(lower_bound, Time.zone.now)
      errors << "Issued at of #{jwt[:iat]} not between #{lower_bound.to_i} and #{Time.zone.now.to_i}"
    end

    def verify_expiration(jwt)
      now = Time.zone.now
      errors << "Expiration time of #{jwt[:exp]} before #{now.to_i}" unless Time.zone.at(jwt[:exp]) > Time.zone.now
    end

    def issued_at_lower_bound
      ENV.key?('issued_at_minutes_ago') ? ENV['issued_at_minutes_ago'].to_i.minutes.ago : 1.week.ago
    end
  end
end
