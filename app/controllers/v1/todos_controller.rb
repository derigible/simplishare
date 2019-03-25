# frozen_string_literal: true

# To update a top-level todo, just pass the updates as needed
#   - The id in the path will point to the record in the database
# To add a new sub-level todo, pass in the parent chain and the new sub-level todo
#   - The id in the path should be new-sub-task
#   - If the parentChain is not valid, throws a RecordNotFound
#   - If valid, will create a new subtask under the last todo in the parentChain
# To update an exisiting sub-level todo, pass in the parentChain and the id with the updates
#   - The id in the path should be the id of the todo to update
#   - If the parentChain is not valid, throws a RecordNotFound
# If id in the path does not equal one of those three, RecordNotFound is thrown
module V1
  class TodosController < ApiController
    include V1::Concerns::VirtualEntitySharing
    include V1::Concerns::VirtualEntityPreferences
    include V1::Concerns::VirtualEntityActions

    def destroy
      if @ve.present?
        super
      else
        @ve = find_db_record_from_parent_chain
        authorize(@ve, :destroy_entity?)
        todo_handler.destroy_sub_todo
        head :no_content
      end
    end

    private

    def entity_model
      Todo
    end

    def load_virtual_entity
      @ve = if %w[update archive].include? params[:action]
              find_todo_for_update
            else
              VirtualEntity.find_by!(id: params[:id])
            end
    end

    def perform_update
      authorize(@ve)
      todo_handler.update
    end

    def perform_archive(policy)
      if todo_handler.not_subtask?
        authorize(@ve)
        update_archived(policy, request_params[:archived], request_params[:update_shared])
      else
        raise Pundit::NotAuthorizedError, query: :archive?, record: @ve, policy: policy unless policy.update?
        todo_handler.update
      end
    end

    def create_params
      {
        priority: request_params[:priority],
        data: {
          todos: request_params[:todos],
          title: request_params[:title],
          description: request_params[:description]
        }.compact
      }.compact
    end

    def request_params
      @request_params ||= params
                          .require(:todo)
                          .permit(
                            :description,
                            :priority,
                            :archived,
                            :update_shared,
                            :title,
                            :todos,
                            parent_chain: []
                          )
    end

    def serializer
      TodoSerializer
    end

    # Delegate

    def todo_handler
      @todo_handler ||= V1::Handlers::TodoHandler.new(@ve, current_user, params)
    end

    # Find methods

    def find_db_record_from_parent_chain
      VirtualEntity.find params[:parent_chain]&.first
    end

    def find_todo_for_update
      if params[:id] != 'new-sub-task' && (params[:parent_chain].nil? || params[:parent_chain].size == 1)
        VirtualEntity.find params[:id]
      else
        find_db_record_from_parent_chain
      end
    end
  end
end
