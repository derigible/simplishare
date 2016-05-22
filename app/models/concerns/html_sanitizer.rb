module HtmlSanitizer
  extend ActiveSupport::Concern

  included do
    def html_sanitize(to_sanitize)
      to_sanitize.each do |field|
        current_value = send(field.to_s)
        send(
          "#{field}=",
          Sanitize.fragment(
            current_value, Sanitize::Config::RELAXED
          )
        ) unless current_value.nil?
      end
    end
  end
end
