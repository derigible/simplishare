module V1
  class CategoryEventLinkController < ApiController
    def create
      @category = Category.find(params[:account_id])
      @event = Event.find(params[:event_id])
      @cat_event = CategoriesEvent.create(category: @category,
                                          event: @trans_event)
      respond_with @cat_event, serializer: V1::CategoriesEventSerializer, status: :created
    end

    def destroy
      @category_event = CategoriesEvent.find(params[:id])
      @category_event.destroy
      head :no_content
    end
  end
end
