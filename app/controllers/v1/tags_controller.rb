module V1
  class TagsController < ApiController
    before_action :load_tag, except: [:index, :create]

    def index
      tags = paginate TagTypeFilter.new(params, policy_scope(Tag)).filter
      respond_with tags, each_serializer: TagSerializer
    end

    def update
      @tag.update(tag_params)
      respond_with @tag, status: :ok, serializer: TagSerializer
    end

    def create
      tag = Tag.new(tag_params)
      tag.user = current_user
      authorize tag
      tag.save
      respond_with tag, status: :created, serializer: TagSerializer
    end

    def show
      respond_with @tag, serializer: TagSerializer
    end

    def destroy
      @tag.destroy
      head :no_content
    end

    private

    def load_tag
      @tag = Tag.find(params[:id])
    end

    def tag_params
      params.require(:tag).permit(:name)
    end
  end
end
