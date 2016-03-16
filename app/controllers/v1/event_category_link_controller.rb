module V1
  class EventCategoryLinkController < ApiController
    def create
      @category = Category.find(params[:account_id])
      @event = Event.find(params[:event_id])
      @event_cat = EventsCategory.create(category: @category,
                                         event: @trans_event)
      respond_with @event_cat, serializer: V1::EventsCategorySerializer, status: :created
    end

    def destroy
      @event_category = EventsCategory.find(params[:id])
      @event_category.destroy
      head :no_content
    end
  end
end
