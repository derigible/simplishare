require 'spec_helper'

describe HtmlSanitizer do
  MockColumn = Struct.new('Column', :type)

  let(:mock_active_record) do
    Class.new do
      include HtmlSanitizer
      attr_accessor :one, :two, :three

      def initialize
        @one = '<p>Hello World</p>'
        @two = '<script>Hello World 2</script>'
        @three = 3
      end
    end.new
  end

  it 'sanitizes columns but leaves regular html' do
    mock_active_record.html_sanitize([:one])
    expect(mock_active_record.one).to eq '<p>Hello World</p>'
  end

  it 'sanitizes columns by removing script tags' do
    mock_active_record.html_sanitize([:two])
    expect(mock_active_record.two).to eq 'Hello World 2'
  end
end
