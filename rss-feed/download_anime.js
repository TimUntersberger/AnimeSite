const WebTorrent = require("webtorrent");
const { execSync }   = require("child_process");
const path       = require("path");
const torrentClient = new WebTorrent();

function convertMkvToMp4(src, dest){
  console.debug("[DEBUG]: Extracting subtitles")
  execSync(`ffmpeg -loglevel panic -i "${src}" -c:s:0 ass -y subtitles.ass`);
  console.debug("[DEBUG]: Burning subtitles into mp4 file")
  console.debug("[DEBUG]: Starting at " + new Date())
  execSync(`ffmpeg -loglevel panic -i "${src}" -vf ass=subtitles.ass -c:a copy -c:v libx264 -crf 18 -maxrate 4000k -loglevel panic -y "${dest}"`);
  console.debug("[DEBUG]: Finishing at " + new Date())
  console.debug("[DEBUG]: Cleaning up...");
  execSync(`rm subtitles.ass "${src}"`);
  return dest;
}

function downloadTorrent(url){
  return new Promise((resolve, reject) => {
    const episodePath = path.join(__dirname);
    torrentClient.add(url, {
      path: episodePath
    }, torrent => {
      const interval = setInterval(() => {
        if(torrent.progress === 1){
          console.log("[DEBUG]: Converting to mp4...");
          clearInterval(interval);
          const file = torrent.files[0];
          resolve(convertMkvToMp4(path.join(episodePath, file.name), path.join(episodePath, file.name.split(".")[0] + ".mp4")));
        }
        else
          console.log("[DEBUG]: " + (torrent.progress * 100).toFixed(2) + "%", (torrent.downloadSpeed / 1000000).toFixed(2) + " Mb/s");
      }, 1000);
    });
  });
}

module.exports = {
  downloadTorrent,
  convertMkvToMp4
};
