const fs         = require("fs");
const WebTorrent = require("webtorrent");
const { execSync }   = require("child_process");
const path       = require("path");
const openload   = require("node-openload");

const torrentClient     = new WebTorrent();
const openloadClient    = openload({
  api_login: "c8594040b0e4d34c",
  api_key: "I0OFYjfT"
});

// openloadClient
//   .upload({
//     file: path.join(__dirname, "/anime/100% Pascal-sensei/36/[HorribleSubs] Banana Fish - 03 [1080p].mp4")
//   }, progress => {
//     console.log(progress);
//   })
//  .then(res => {
//    console.log(res)});
// return;
const database   = JSON.parse(fs.readFileSync(path.join(__dirname, "/scraper/database.json")));
//Beelzebub: not all episodes
//3-gatsu no Lion no episodes

function convertMkvToMp4(src, dest){
  console.debug("[DEBUG]: Copying video and audio codecs to mp4 file")
  execSync(`ffmpeg -i "${src}" -c copy -y "${dest}"`);
  console.debug("[DEBUG]: Extracting subtitles")
  execSync(`ffmpeg -i "${src}" -c:s:0 ass -y subtitles.ass`);
  console.debug("[DEBUG]: Burning subtitles into mp4 file")
  console.debug("[DEBUG]: Starting at " + new Date())
  execSync(`ffmpeg -i "${src}" -vf "ass=subtitles.ass" -c:a copy -b:v 6000k -minrate 6000k  -y "${dest}"`);
  console.debug("[DEBUG]: Finishing at " + new Date())
  console.log("Finished converting file")
}

Object.keys(database).slice(0, 1).forEach(key => {
  console.log("Downloading '" + key + "'");
  const showPath = path.join(__dirname, "/anime/" + key);
  if(!fs.existsSync(showPath))
    fs.mkdirSync(showPath);
  database[key].slice(0, 1).forEach(async episode => {
    const episodePath = path.join(showPath, episode.number);
    if(!fs.existsSync(episodePath))
      fs.mkdirSync(episodePath);
    if(episode.links["720p"]){
      const link = episode.links["720p"].filter(link => link.type === "Torrent")[0];
      if(link){
        console.log(" Started 720p torrent download...")
        await new Promise((resolve, reject) => {
          torrentClient.add("https://nyaa.si/download/1058248.torrent", {
            path: episodePath
          }, torrent => {
            const interval = setInterval(() => {
              if(torrent.progress === 1){
                console.log("Converting to mp4...");
                clearInterval(interval);
                const file = torrent.files[0];
                convertMkvToMp4(path.join(episodePath, file.name), path.join(episodePath, file.name.split(".")[0] + ".mp4"))
              }
              else
                console.log("   " + (torrent.progress * 100) + "%", (torrent.downloadSpeed / 1000) + " Kb/s");
            }, 1000);
            resolve();
          });
        });
      }
    }
    // Object.keys(episode.links).forEach(key => {
    //   const linkPath = path.join(episodePath, key + ".txt");
    //   if(!fs.existsSync(linkPath))
    //     fs.writeFileSync(linkPath, JSON.stringify(episode.links[key]));
    // });
  });
  database[key]
});