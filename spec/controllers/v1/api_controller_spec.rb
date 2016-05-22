require 'spec_helper'

describe V1::ApiController do
  it { is_expected.to rescue_from(ActionController::ParameterMissing) }
  it { is_expected.to rescue_from(ActiveRecord::RecordInvalid) }
  it { is_expected.to rescue_from(ActiveRecord::RecordNotFound) }
  it { is_expected.to rescue_from(JWT::ExpiredSignature) }

  describe '#error_render' do
    let(:error) { instance_double(ActiveRecord::RecordNotFound, message: 'This is a test') }

    it 'renders error' do
      expect_any_instance_of(ActionController::Rendering)
        .to receive(:render).with(json: { error: 'This is a test' }, status: 404)

      controller.send('error_render', error, 404)
    end
  end

  describe '#in_user_timezone' do
    context 'with authenticated request' do
      it 'runs block in user timezone'
    end

    context 'with unauthenticated request' do
      it 'runs block in system timezone'
    end
  end

  describe 'prepend_before_action :doorkeeper_authorize!' do
    controller(V1::ApiController) do
      def index
        render nothing: true, status: :ok
      end
    end

    context 'when doorkeeper token is not present' do
      let(:token) { double acceptable?: false, accessible?: false }

      it 'renders 401' do
        get :index, format: :json
        expect(response).to have_http_status(401)
      end
    end
  end

  describe '#current_resource_owner' do
    subject(:api_controller) do
      described_class.new
    end

    context 'when token is present' do
      let(:user) { create(:user) }
      let(:token) do
        double(
          acceptable?: true,
          scopes: [:api],
          resource_owner_id: user.id
        )
      end
      before do
        allow(api_controller).to receive(:doorkeeper_token) { token }
      end

      it 'returns user indicated by doorkeeper_token' do
        expect(api_controller.current_resource_owner).to eq user
      end
    end
  end
end
