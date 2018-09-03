# frozen_string_literal: true

module V1
  class AccountSerializer < ActiveModel::Serializer
    attributes :id, :name
  end
end
