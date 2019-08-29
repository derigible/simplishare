# frozen_string_literal: true

module V1
  class TagsController < ApiController
    def index
      tags = policy_scope(Tag).all
      respond_with tags, each_serializer: TagSerializer
    end

    def create
      tag = Tag.new(tag_params)
      vtag = VirtualTag.new user: current_user
      authorize vtag
      tag.save!
      vtag.tag = tag
      vtag.save
      respond_with vtag, status: :created, serializer: TagSerializer
    end

    private

    def tag_params
      params.require(:tag).permit(:name)
    end
  end
end
