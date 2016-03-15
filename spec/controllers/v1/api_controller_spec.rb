require 'spec_helper'

module V1
  describe ApiController do
    controller do
      def param_missing
        raise ActionController::ParameterMissing.new('field')
      end

      def not_found
        raise ActiveRecord::RecordNotFound.new('message')
      end
    end

    before do
      routes.draw do
        scope :api, module: 'api/v1' do
          get ':action', controller: 'api'
        end
      end
    end

    context '#error_renderer' do
      it 'rescues from ParameterMissing' do
        get :param_missing
        expect(response.code).to eq('400')
        expect(response.body).to eq(
          { error: 'param is missing or the value is empty: field' }.to_json
        )
      end

      it 'rescues from RecordNotFound' do
        get :not_found
        expect(response.code).to eq('404')
        expect(response.body).to eq({ error: 'message' }.to_json)
      end
    end

    context '#current_resource_owner' do
      it 'should '
    end
  end
end
