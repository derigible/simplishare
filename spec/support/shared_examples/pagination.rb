shared_examples 'a paginated resource' do |factory, relations = []|
  before(:all) do
    @related_data = {}
    relations.each do |model|
      record = create model
      @related_data["#{model.to_s}_id"] = record.id
    end
    create_list factory, 5, @related_data
  end

  let(:json) { JSON.parse(response.body) }

  it 'paginates the response' do
    skip 'pagination needs to be configured'
    get :index, @related_data
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(1)
  end

  it 'allows a client to override per_page' do
    skip 'pagination needs to be configured'
    get :index, @related_data, per_page: 2
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(2)
  end

  it 'enforces a max per_page' do
    skip 'pagination needs to be configured'
    get :index, @related_data, per_page: 5
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(3)
  end

  it 'includes a Link header' do
    skip 'pagination needs to be configured'
    get :index, @related_data, page: 3
    link_header = response.headers['Link']

    expect(link_header).not_to be_nil
    expect(link_header).to match('first')
    expect(link_header).to match('prev')
    expect(link_header).to match('last')
    expect(link_header).to match('next')
  end
end
