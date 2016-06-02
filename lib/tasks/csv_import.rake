desc "Uploads a csv into the events table"
task :csv_import, [:filename] do |_, args|
  filename = args[:filename]
  raise 'Filename not specified!' if filename.blank?
  require 'csv'

  CSV.foreach(filename, headers: true) do |row|
    Event.create!(row.to_hash)
  end
end
