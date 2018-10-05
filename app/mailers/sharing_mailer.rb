# frozen_string_literal: true

class SharingMailer < ApplicationMailer
  default from: 'noreply@pinkairship.com'
  PINKAIRSHIP = Rails.configuration.x.pinkairship
  PINKAIRSHIP_ADDRESS = "#{PINKAIRSHIP[:protocol]}://#{PINKAIRSHIP[:host]}"

  def self.send_update(user, entity)
    entity.shared_with_except_users(user).each do |ve|
      next if ve.skip_notification?(:email, entity.type, :update)
      on_update(user, ve, entity.type).deliver_now
    end
  end

  def on_update(user, virtual_entity, type)
    @user = user
    @type = type
    @virtual_entity = virtual_entity
    @url = "#{PINKAIRSHIP_ADDRESS}/#{@type.downcase.pluralize}/read/#{@virtual_entity.id}"
    mail(to: virtual_entity.user.email, subject: "#{@user.email} has updated a #{@type}")
  end

  def on_share
    @user = params[:user]
    @virtual_entity = params[:virtual_entity]
    @type = @virtual_entity.entity.type
    @shared_with = @virtual_entity.user
    @url = "#{PINKAIRSHIP_ADDRESS}/#{@type.downcase.pluralize}/read/#{@virtual_entity.id}"
    mail(to: @shared_with.email, subject: "#{@user.email} has shared a #{@type}")
  end
end
