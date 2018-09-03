# frozen_string_literal: true

module HtmlSanitizer
  extend ActiveSupport::Concern

  included do
    def html_sanitize(to_sanitize)
      to_sanitize.each do |field|
        current_value = send(field.to_s)
        next if current_value.nil?
        send(
          "#{field}=",
          Sanitize.fragment(
            current_value, Sanitize::Config::RELAXED
          )
        )
      end
    end
  end
end
