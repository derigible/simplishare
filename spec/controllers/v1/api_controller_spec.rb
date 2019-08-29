# frozen_string_literal: true

require 'spec_helper'

describe V1::ApiController do
  it { is_expected.to rescue_from(ActionController::ParameterMissing) }
  it { is_expected.to rescue_from(ActiveRecord::RecordInvalid) }
  it { is_expected.to rescue_from(ActiveRecord::RecordNotFound) }
  it { is_expected.to rescue_from(ActionController::BadRequest) }
  it { is_expected.to rescue_from(Pundit::NotAuthorizedError) }
  it { is_expected.to rescue_from(BaseFilter::InvalidLookupTermError) }
  it { is_expected.to rescue_from(BaseFilter::InvalidLookupParamError) }

  describe '#error_render' do
    let(:error) { instance_double(ActiveRecord::RecordNotFound, message: 'This is a test') }

    it 'renders error' do
      expect_any_instance_of(ActionController::Rendering)
        .to receive(:render).with(json: { error: 'This is a test' }, status: 404)

      controller.send('error_render', error, 404)
    end
  end

  describe 'authenticate user before action' do
    controller(described_class) do
      def index
        skip_policy_scope
        render json: current_user
      end
    end

    subject { get :index, format: :json }

    it 'uses the correct user' do
      subject
      expect(json['id']).to eq current_user.id
    end

    context 'with unauthenticated user' do
      before do
        allow(controller).to receive(:session).and_return('current_user_id' => -1)
      end

      it { is_expected.to have_http_status :unauthorized }
    end
  end
end
