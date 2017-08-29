module V1
  class CategoriesController < ApiController
    before_action :load_category, except: [:index]

    def index
      @categories = ApiPagination.paginate policy_scope(Category)
      respond_with @categories, each_serializer: CategorySerializer
    end

    def update
      @category.update(account_params)
      respond_with @category, status: :ok, serializer: CategorySerializer
    end

    def create
      @category = Category.new(account_params)
      authorize @category
      @category.save
      respond_with @category, status: :created, serializer: CategorySerializer
    end

    def show
      respond_with @category, serializer: V1::Detailed::CategorySerializer
    end

    def destroy
      @category.destroy
      head :no_content
    end

    private

    def load_category
      @category = Category.find(params[:id])
    end

    def account_params
      params.require(:category).permit(:title)
    end
  end
end
