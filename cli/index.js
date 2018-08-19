const uploadAnime = require("../rss-feed/upload_anime");
const fs = require("fs");
const path = require("path");
const convertMkvToMp4 = require("../rss-feed/download_anime").convertMkvToMp4;
const axios = require("axios");

fs.readdirSync(__dirname).forEach(fileName => {
  if(!fileName.endsWith(".mkv")) return;
  const filePath = path.join(__dirname, fileName);
  const file = fs.readFileSync(filePath);
  const tokens = /\] (.*) \[/.exec(fileName)[1].split(" - ");
  const title = tokens[0];
  const episode = tokens[1];
  const dest = filePath.replace(".mkv", ".mp4");
  console.log(`[DEBUG]: Beginning conversion of ${title} episode ${episode}`)
  convertMkvToMp4(filePath, dest);
  console.log(`[DEBUG]: Finished conversion of ${title} episode ${episode}`)
});

uploadEpisodes();

async function uploadEpisodes(){
  for(fileName of fs.readdirSync(__dirname)){
    if(!fileName.endsWith(".mp4")) return;
    const filePath = path.join(__dirname, fileName);
    const tokens = /\] (.*) \[/.exec(fileName)[1].split(" - ");
    const title = tokens[0];
    const episode = tokens[1];
    await uploadEpisode({
      title,
      episode,
      filePath
    })
  }
}

async function uploadEpisode(info){
  console.log("[DEBUG]: Starting upload of '" + info.title + " - " + info.episode + "'")
  const url = await uploadAnime(
    info.filePath,
    info.title + "/" + info.episode + ".mp4"
  )
  console.log("[DEBUG]: Finished upload of '" + info.title + " - " + info.episode + "'")
  return axios.post(`https://baaka.io/api/${info.title}/${info.episode}`, { url }, {
    headers: {
      Authorization: "Basic test"
    }
  });
}