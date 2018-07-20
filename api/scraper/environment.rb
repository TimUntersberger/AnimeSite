#shows.indexOf(shows.filter(e => e.children[0] != undefined).filter(e => e.children[0].getAttribute("title") === "Beelzebub")[0])

require_relative "lib/HorribleSubs/Api/client.rb"
require "json"
require "nokogiri"

testing = false
api_client = HorribleSubs::Api::Client.new debug: false 
shows = api_client.get_shows
shows_h = {}
count = 0
shows[0..99].each do |show|
  show = api_client.get_show(show)
  puts "#{"%04d" % count+=1}. Show #{show.name}"
  shows_h[show.name] = api_client.get_episodes(show_id: show.id)
end
# path because its get called from root folder
open("backend/scraper/database.#{testing ? "testing." : ""}json", "w") do |file|
 file.puts shows_h.to_json
end

# html = Nokogiri::HTML('<div class="rls-link link-1080p" id="01-1080p">
# <span class="rls-link-label">1080p:</span><span class="dl-type hs-magnet-link"><a title="Magnet Link" href="magnet:?xt=urn:btih:XPHK2U62N6CDVITDTYD4CUNA2OZ4CXBE&amp;tr=udp://tracker.coppersurfer.tk:6969/announce&amp;tr=udp://tracker.internetwarriors.net:1337/announce&amp;tr=udp://tracker.leechersparadise.org:6969/announce&amp;tr=udp://tracker.opentrackr.org:1337/announce&amp;tr=udp://open.stealth.si:80/announce&amp;tr=udp://p4p.arenabg.com:1337/announce&amp;tr=udp://mgtracker.org:6969/announce&amp;tr=udp://tracker.tiny-vps.com:6969/announce&amp;tr=udp://peerfect.org:6969/announce&amp;tr=http://share.camoe.cn:8080/announce&amp;tr=http://t.nyaatracker.com:80/announce&amp;tr=https://open.kickasstracker.com:443/announce">Magnet</a></span>|<span class="linkless dl-type hs-torrent-link">Torrent</span>|<span class="dl-type hs-xdcc-link"><a title="XDCC search" href="https://xdcc.horriblesubs.info/?search=%5BHorribleSubs%5D%2091%20Days%20-%2001%20%5B1080p%5D" target="_blank">XDCC</a> [<a title="XDCC guide" href="/irc-guide/">?</a>]</span>|<span class="dl-type hs-ddl-link"><a title="Download from Uploaded.net" href="http://uploaded.net/file/cl8y7ipi" target="_blank">Uploaded.net</a></span>|<span class="linkless dl-type hs-ddl-link">FileUpload</span>|<span class="linkless dl-type hs-ddl-link">Uplod</span>
# </div>')

# puts html.css("span.dl-type:not(.linkless) a")