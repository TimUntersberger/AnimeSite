module HorribleSubs
	module Api
		class Show
      attr_accessor :id, :image, :description, :href, :title, :name

			def initialize(href:, title:, name:)
				@href = href
				@title = title
				@name = name
			end
		end
	end
end
