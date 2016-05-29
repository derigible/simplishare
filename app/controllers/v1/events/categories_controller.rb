module V1::Events
  class CategoriesController < V1::ApiController
    def index
      @categories = paginate nested_scope
      respond_with @categories, each_serializer: V1::CategorySerializer
    end

    def create
      @category = nested_scope.create(category_params)
      respond_with @category, serializer: V1::CategorySerializer, status: :created
    end

    private

    def category_params
      params.require(:category).permit(:title)
    end

    def nested_scope
      Event.find(params.require(:event_id)).categories
    end
  end
end
