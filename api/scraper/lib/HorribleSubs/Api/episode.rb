require_relative "json_serializable.rb"

module HorribleSubs
  module Api
    class Episode
      include JsonSerializable

      attr_accessor :number, :links

      def initialize(number:, links:)
        @links = links
        @number = number
      end
    end
  end
end