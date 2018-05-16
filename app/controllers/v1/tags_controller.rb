module V1
  class TagsController < ApiController
    before_action :load_tag, except: [:index]

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
      authorize tag
      if tag.save
        attach_record_if_present(tag)
      end
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

    def attach_params
      params.permit(attach: {})
    end

    def attach_type
      attach_params[:type].capitalize.constantize
    end

    def attach_record_if_present(tag)
      return if attach_params.blank?
      raise(
        ActionController::BadRequest, "Attach specified but type was not one of #{Tag::TYPES}"
      ) unless Tag::TYPES.include? attach_params[:type]
      record = attach_type.find attach_params[:id]
      authorize record, :update
      tag.send(attach_params[:type].pluralize) << record
    end
  end
end
