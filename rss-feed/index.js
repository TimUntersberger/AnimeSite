require("dotenv").load();
const RssFeedWatcher = require("rss-feed-watcher");
const path = require("path");
const downloadAnime = require("./download_anime");
const fs = require("fs");
const uploadAnime = require("./upload_anime");
const { insertEpisode } = require("./save_anime");
const watcher = new RssFeedWatcher("http://www.horriblesubs.info/rss.php?res=1080");
const WHITE_LIST = fs
  .readFileSync(path.join(__dirname, "../.anime_white_list"))
  .toString()
  .split("\n");

watcher.on("new item", item => {
  const tokens = /\] (.*) \[/.exec(item.title)[1].split(" - ")
  let showTitle = "";
  if(tokens.length === 2)
    showTitle = tokens[0];
  else
    showTitle = tokens.splice(0, tokens.length - 2).join(" - ");

  if(!WHITE_LIST.includes(showTitle)) return;

  const episode = tokens[tokens.length - 1];
  console.log("[INFO]: Starting download of '" + showTitle + " - " + episode + "'")
  downloadAnime(item.link)
    .then(filePath => {
      console.log("[INFO]: Finished download of '" + showTitle + " - " + episode + "'")
      console.log("[INFO]: Starting upload of '" + showTitle + " - " + episode + "'")
      uploadAnime(
        filePath,
        showTitle + "/" + episode + ".mp4"
      ).then(url => {
        console.log("[INFO]: Finished upload of '" + showTitle + " - " + episode + "'")
        insertEpisode(
          showTitle,
          {
            episodeNumber: episode,
            url
          }
        )
      });
    });
})

watcher.start();






      
