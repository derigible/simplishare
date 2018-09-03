# frozen_string_literal: true

desc "Uploads a csv into the events table"
task :csv_import, [:filename] => :environment do |_, args|
  filename = args[:filename]
  raise 'Filename not specified!' if filename.blank?
  require 'csv'

  allowed_attrs = Event.new.attributes.keys

  CSV.foreach(filename, headers: true) do |row|
    row = row.to_hash
    sanitized = row.each_with_object({}) do |(key, value), hash|
      hash[key.strip.downcase.sub(/\s+/, '_')] = value
    end
    sanitized.keep_if { |k, _| allowed_attrs.include? k }
    Event.create!(sanitized)
  end
end
