describe 'csv_import' do
  include_context 'rake'

  it 'requires a filenmae' do
    expect { subject.invoke }.to raise_error('Filename not specified!')
  end

  it 'creates five new events' do
    filename = Rails.root.join 'spec', 'fixtures', 'events.csv'
    expect { subject.invoke(filename) }.to change { Event.count }.by 5
  end
end
