# frozen_string_literal: true

shared_examples 'a paginated resource' do
  let(:params) { {} }
  let(:create_entity_list) { raise 'Override in spec' }

  before(:all) do
    @old_per_page = Pagy::VARS[:items] = 50
    @old_max_per_page = Pagy::VARS[:max_per_page] = 200
  end

  before do
    Pagy::VARS[:items] = 1
    Pagy::VARS[:max_per_page] = 3

    create_entity_list.call(5)
  end

  after(:all) do
    Pagy::VARS[:items] = @old_per_page
    Pagy::VARS[:max_per_page] = @old_max_per_page
  end

  it 'paginates the response' do
    get :index, params: params
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(1)
  end

  it 'allows a client to override per_page' do
    get :index, params: params.merge(per_page: 2)
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(2)
  end

  it 'enforces a max per_page' do
    get :index, params: params.merge(per_page: 5)
    resource_ids = json.map { |resource| resource['id'] }
    expect(resource_ids.count).to eq(3)
  end

  it 'includes a Link header' do
    get :index, params: params.merge(page: 3)
    link_header = response.headers['Link']

    expect(link_header).not_to be_nil
    expect(link_header).to match('first')
    expect(link_header).to match('prev')
    expect(link_header).to match('last')
    expect(link_header).to match('next')
  end
end
