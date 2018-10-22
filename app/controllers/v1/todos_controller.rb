# frozen_string_literal: true

module V1
  class TodosController < ApiController
    include V1::Concerns::VirtualEntitySharing
    include V1::Concerns::VirtualEntityPreferences

    def index
      todos = paginate TodosFilter.new(
        params,
        policy_scope(Todo).eager_load(:virtual_tags).select('virtual_tags.id')
      ).filter
      respond_with todos, each_serializer: serializer
    end

    #
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
    def update
      skip_authorization
      @ve = find_todo_for_update
      todo_delegate.update
      todo_delegate.change_archive_if_requested
      send_update_notifications
      respond_with @ve, status: :ok, serializer: serializer
    end

    def create
      todo = Todo.new(todo_create_params)
      ve = VirtualEntity.new(user: current_user)
      authorize todo
      todo.save!
      ve.entity = todo
      ve.save
      respond_with ve, status: :created, serializer: serializer
    end

    def show
      ve = VirtualEntity.find params[:id]
      authorize(ve)
      respond_with ve, serializer: Todo
    end

    def destroy
      skip_authorization
      @ve = VirtualEntity.find_by(id: params[:id])
      if @ve.present?
        todo_delegate.destroy_record
      else
        @ve = find_db_record_from_parent_chain
        authorize(@ve, :destroy_entity?)
        todo_delegate.destroy_sub_todo
      end
      head :no_content
    end

    private

    def todo_delegate
      @todo_delegate ||= V1::Concerns::TodoDelegate.new(@ve, current_user, params)
    end

    def find_db_record_from_parent_chain
      VirtualEntity.find params[:parent_chain].first
    end

    def find_todo_for_update
      if params[:id] != 'new-sub-task' && (params[:parent_chain].nil? || params[:parent_chain].size == 1)
        VirtualEntity.find params[:id]
      else
        find_db_record_from_parent_chain
      end
    end

    def send_update_notifications
      if todo_delegate.archive_only?
        SharingMailer.send_archive(current_user, @ve)
      elsif todo_delegate.archived?
        SharingMailer.send_archive_and_update(current_user, @ve)
      else
        SharingMailer.send_update(current_user, @ve.entity)
      end
    end

    def todo_create_params
      request_params = params.require(:todo)
                             .permit(:description, :priority, :todos, :title)
      {
        priority: request_params[:priority],
        data: {
          todos: request_params[:todos],
          title: request_params[:title],
          description: request_params[:description]
        }.compact
      }.compact
    end

    def serializer
      TodoSerializer
    end
  end
end
