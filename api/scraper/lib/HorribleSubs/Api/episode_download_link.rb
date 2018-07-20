module HorribleSubs
	module Api
    class EpisodeDownloadLink
      include JsonSerializable

      attr_accessor :video_quality, :url, :type, 

      def initialize(video_quality:, url:, type:)
        @video_quality = video_quality
        @url = url
        @type = type
      end
    end
	end
end
