module V1::Events
  class CategoriesController < V1::ApiController
    before_action :require_categories

    def index
      respond_with @categories, each_serializer: V1::CategorySerializer
    end

    def create
      @category = @categories.create(category_params)
      respond_with @category, serializer: V1::CategorySerializer, status: :created
    end

    private

    def category_params
      params.require(:category).permit(:title)
    end

    def require_categories
      @categories = Event.find(params.require(:event_id)).categories
    end
  end
end
