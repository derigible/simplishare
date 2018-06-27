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
end
