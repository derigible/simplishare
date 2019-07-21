# frozen_string_literal: true

module V1
  class NotificationsController < ApiController
    before_action :load_notification, except: %i[index create]

    def index
      respond_with policy_scope(Notification), each_serializer: NotificationSerializer
    end

    def create
      head :no_content
    end

    def update
      @notification.update(notification_params)
      respond_with @notification, serializer: NotificationSerializer
    end

    def show
      respond_with @notification, serializer: NotificationSerializer
    end

    def destroy
      @notification.destroy
      head :no_content
    end

    private

    def load_notification
      @notification = Notification.find(params[:id])
    end

    def notification_params
      params.require(:notification).permit(:data, :read)
    end
  end
end
