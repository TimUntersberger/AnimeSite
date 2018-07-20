require "nokogiri"
require "faraday"
require "faraday_middleware"
require_relative "show.rb"
require_relative "episode.rb"
require_relative "episode_download_link.rb"

module HorribleSubs
	module Api
		class Client
			def initialize(debug_http: false, debug: false)
        @api = Faraday.new(:url => "https://horriblesubs.info/") do |faraday|
          faraday.response :logger if debug_http
					faraday.adapter Faraday.default_adapter
        end
        @debug = debug
			end

			def get_shows
				res = @api.get("shows/")
				html = Nokogiri::HTML(res.body)
				shows = []
				html.css(".ind-show a").each do |element|
					href = element["href"]
					title = element["title"]
					name = element.text
					shows.push(Show.new(
						href: href,
						title: title,
						name: name
					))
				end
				shows
      end

			def get_show(show)
				res = @api.get(show.href + "/")
				html = Nokogiri::HTML(res.body)
				desc = ""
				html.css(".series-desc p").each do |p|
					desc += "\n\n" unless desc == ""
					desc += p.text
        end
				image = @api.build_url(html.at_css(".series-image img")["src"])
        id = html.at_css(".entry-content script").text.split(" ").last[0..-2]
        show.id = id
        show.description = desc
        show.image = image
        show
      end
      
      def get_episodes(show_id:)
        episodes = []
        episodes_url = "api.php?method=getshows&type=show&showid=#{show_id}"
        episodes_page = 1
        loop do
          body = @api.get(episodes_url).body
          break if body == "DONE"
          episodes_url = "api.php?method=getshows&type=show&showid=#{show_id}&nextid=#{episodes_page}"
          episodes_page += 1
          body_html = Nokogiri::HTML(body)
          body_html.css(".rls-info-container").each do |episode_html|
            episode_number = episode_html["id"].gsub("-", ".")
            upload_date = episode_html.css("a.rls-label span.rls-date").text
            links = {}
            puts "  Episode " + episode_number if @debug
            episode_html.css("div.rls-links-container div.rls-link").each do |links_html| 
              video_quality = links_html["class"].split("-").last
              puts "    Links " + video_quality if @debug
              links_html.css("span.dl-type:not(.linkless)").each do |link_container_html|
                link_html = link_container_html.at_css("a")
                episode_download_link = EpisodeDownloadLink.new
                episode_download_link.type = link_html.text.to_sym
                next if episode_download_link.type == :XDCC
                episode_download_link.video_quality = video_quality
                episode_download_link.url = link_html["href"]
                puts "      Link " + episode_download_link.type.to_s if @debug
                links[video_quality] = [] if links[video_quality] == nil
                links[video_quality].push(episode_download_link)
              end
            end
            episodes.push(Episode.new(number: episode_number, links: links))
          end
        end
        episodes
      end
    end
	end
end
