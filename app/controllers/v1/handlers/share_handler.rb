# frozen_string_literal: true

module V1::Handlers
  class ShareHandler
    attr_reader :virtual_entity

    def initialize(ve, parameters, current_user)
      @params = parameters
      @current_user = current_user
      @ve = ve
    end

    def cannot_view_shared_with?
      !@ve.entity_owner? && @ve.permissions.exclude?('share')
    end

    def mark_as_shared
      @ve.metadata[:shared] = true and @ve.save! unless @ve.metadata[:shared]
    end

    def retrieve_shared_with
      if !@ve.entity_owner?
        shared_with = retrieve_shared_with_except_current_user_and_owner
        owner_ve.permissions = ['owner']
        shared_with << owner_ve
        filtered_by_shared_contacts(shared_with, owner_ve.user_id)
      else
        @ve.entity.shared_with_except_users([current_user])
      end
    end

    def share_or_update_permissions
      to_share_with.each do |user|
        already_shared_with_ve = find_shared_with_ve(user)
        permissions = extract_permissions(user)
        if already_shared_with_ve.present? && permissions.exclude?('owner')
          update_permissions(@ve.entity, already_shared_with_ve.user_id, permissions)
        elsif permissions.exclude?('owner')
          share_with_user(@ve.entity, user, permissions)
        end
      end
    end

    def unshare
      @ve.entity
         .shared_with_except_users([current_user])
         .where(user_id: shared_users_ids)
         .destroy_all
    end

    private

    attr_reader :params, :current_user

    def share_params
      params.require(:share).permit(users: [:id, permissions: []])
    end

    def to_share_with
      User.where(
        id: shared_users_ids.reject { |u_id| u_id == current_user.id }
      )
    end

    def filtered_by_shared_contacts(shared_with, except_id)
      contact_ids = current_user.contacts.pluck(:user_id, :contact_id).flatten.uniq
      shared_with.each_with_object([]) do |v, memo|
        memo << v if v.user_id == except_id || contact_ids.include?(v.user_id)
      end
    end

    def owner_ve
      @owner_ve = @ve.entity.owner_ve
    end

    def retrieve_shared_with_except_current_user_and_owner
      @ve.entity.shared_with_except_users([current_user, owner_ve.user]).to_a
    end

    def extract_permissions(user)
      share_params[:users].find { |u| u[:id] == user.id }[:permissions]
    end

    def find_shared_with_ve(user)
      already_shared_with_ves.find { |u| user.id == u.user_id }
    end

    def already_shared_with_ves
      @already_shared_with_ves = @ve.entity.shared_with_except_users(current_user).to_a
    end

    def share_with_user(entity, user, permissions)
      # only set read on initial share if not set. we want to allow empty permissions still
      perms = permissions.empty? ? ['read'] : permissions
      ve = VirtualEntity.new(
        metadata: { permissions: perms },
        shared_on: Time.zone.now,
        user: user,
        entity: entity
      )
      ve.shared_on = Time.zone.now
      ve.save!
      SharingMailer.with(user: current_user, virtual_entity: ve).on_share.deliver_now
    end

    def shared_users_ids
      share_params[:users].map { |u| u[:id] }
    end

    def update_permissions(entity, user_id, permissions)
      ve = VirtualEntity.find_by! user_id: user_id, entity: entity
      ve.update! metadata: { permissions: permissions }
    end
  end
end
