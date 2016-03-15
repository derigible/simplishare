require 'spec_helper'

module V1
  describe V1::Events::CategoriesController do
    before(:each) { request.headers['Accept'] = "application/vnd.instructure.v1, #{Mime::JSON}" }
    before(:each) { request.headers['Content-Type'] = Mime::JSON.to_s }
    let(:serializer) { V1::CategorySerializer }

    it_behaves_like 'a resource controller'

    context '#index' do
      include_examples "a nested resource controller", :index
      let(:factory) { :categories_event }
      let(:associated_name) { 'event' }
    end

    context '#create' do
      include_examples "a nested resource controller", :create
      let(:factory) { :event }
      let(:nested_attrs) { 'category' }
      let(:to_serialize) { assigns(:category) }

      context 'on success' do
        before :all do
          @quiz = create(:event)
          @params = attributes_for(:category)
        end

        it 'creates a quizzes_items' do
          expect {
            post :create, event_id: @quiz, category: @params
          }.to change { CategoriesEvent.count }.by 1
        end

        it 'creates quizzes_quiz_item to correct quiz and item' do
          post :create, event_id: @quiz, category: @params

          response_body = JSON.parse(response.body)
          ce = CategoriesEvent.where(
            event_id: @quiz.id,
            category_id: response_body['id']
          )

          expect(ce).to be_truthy
        end
      end
    end
  end
end
