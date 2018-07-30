const WebTorrent = require("webtorrent");
const { execSync }   = require("child_process");
const path       = require("path");
const torrentClient = new WebTorrent();

function convertMkvToMp4(src, dest){
  return new Promise((resolve, reject) => {
    console.debug("[DEBUG]: Extracting subtitles")
    execSync(`ffmpeg -i "${src}" -c:s:0 ass -y subtitles.ass`);
    console.debug("[DEBUG]: Burning subtitles into mp4 file")
    console.debug("[DEBUG]: Starting at " + new Date())
    execSync(`ffmpeg -i "${src}" -vf ass=subtitles.ass -c:a copy -c:v libx264 -crf 18 -maxrate 4000k -y "${dest}"`);
    console.debug("[DEBUG]: Finishing at " + new Date())
    console.debug("[DEBUG]: Cleaning up...");
    execSync(`rm subtitles.ass "${src}"`);
    console.log("Finished converting file");
    resolve(dest);
  });
}

function downloadTorrent(url){
  return new Promise((resolve, reject) => {
    console.log(" Started torrent download...")
    const episodePath = path.join(__dirname);
    torrentClient.add(url || "magnet:?xt=urn:btih:BAN4JXY476VKOMQZT3TFN4QXG2VV6H6K&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.internetwarriors.net:1337/announce&tr=udp://tracker.leechersparadise.org:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://mgtracker.org:6969/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://peerfect.org:6969/announce&tr=http://share.camoe.cn:8080/announce&tr=http://t.nyaatracker.com:80/announce&tr=https://open.kickasstracker.com:443/announce", {
      path: episodePath
    }, torrent => {
      const interval = setInterval(() => {
        if(torrent.progress === 1){
          console.log("Converting to mp4...");
          clearInterval(interval);
          const file = torrent.files[0];
          convertMkvToMp4(path.join(episodePath, file.name), path.join(episodePath, file.name.split(".")[0] + ".mp4"))
            .then(resolve)
        }
        else
          console.log("   " + (torrent.progress * 100) + "%", (torrent.downloadSpeed / 1000) + " Kb/s");
      }, 1000);
    });
  });
}

module.exports = downloadTorrent;
