# frozen_string_literal: true

module V1
  class TagsController < ApiController
    before_action :load_virtual_tag, except: %i[index create]

    def index
      tags = paginate TagTypeFilter.new(params, policy_scope(Tag)).filter
      respond_with tags, each_serializer: TagSerializer
    end

    def update
      @vtag.tag.update!(tag_params)
      respond_with @vtag, status: :ok, serializer: TagSerializer
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

    def show
      respond_with @vtag, serializer: TagSerializer
    end

    def destroy
      @vtag.tag.destroy
      head :no_content
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
