module DataFixup
  module GiveDefaultUsername
    class User < ActiveRecord::Base
    end

    class << self
      def run
        generate_unique_name
      end

      private

      def generate_unique_name
        User.all.each_with_index do |u, i|
          u.update_attribute(:username, u.email.split('@').first)
        end
      end
    end
  end
end
