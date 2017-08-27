module V1::Events
  class CategoriesController < V1::ApiController
    def index
      @categories = paginate policy_scope(default_scope)
      respond_with @categories, each_serializer: V1::CategorySerializer
    end

    def create
      @category = default_scope.create(category_params)
      authorize @category
      respond_with @category, serializer: V1::CategorySerializer, status: :created
    end

    private

    def category_params
      params.require(:category).permit(:title)
    end

    def default_scope
      Event.find(params.require(:event_id)).categories
    end
  end
end
