# frozen_string_literal: true

module V1
  class TagsController < ApiController
    before_action :load_virtual_tag, except: %i[index create]

    def index
      tags = paginate policy_scope(Tag)
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

    def load_virtual_tag
      @vtag = VirtualTag.find(params[:id])
    end

    def tag_params
      params.require(:tag).permit(:name)
    end
  end
end
