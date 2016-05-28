module V1
  class CategoriesController < ApiController
    def index
      @categories = Category.all
      respond_with @categories, each_serializer: CategorySerializer
    end

    def update
      @category = Category.find(params[:id])
      @category.update(account_params)
      respond_with @category, status: :ok, serializer: CategorySerializer
    end

    def create
      @category = Category.new(account_params)
      @category.save
      respond_with @category, status: :created, serializer: CategorySerializer
    end

    def show
      @category = Category.find(params[:id])
      respond_with @category, serializer: V1::Detailed::CategorySerializer
    end

    def destroy
      @category = Category.find(params[:id])
      @category.destroy
      head :no_content
    end

    private

    def account_params
      params.require(:category).permit(:title)
    end
  end
end
