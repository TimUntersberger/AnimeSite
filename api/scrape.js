const $ = require("cheerio").load;
const Axios = require("axios");
const delay = require("delay");
const fs = require("fs");
const BASE_URL = "http://animeheaven.eu/";

const database = {};
let count = 0;
let animes = [];

function loadNextShow(){
  if(animes.length == count + 1){
    fs.writeFileSync("backend/database.json", JSON.stringify(database));
    return;
  }
  const e = animes[count];
  const href = e.attribs.href;
  const title = href.split("=")[1];
  database[title] = {
    title,
    url: BASE_URL + href
  };
  console.log(`${count++}.`, title);
  loadShowData(title);
  setTimeout(() => loadNextShow(), 50);
}

Axios
  .get(BASE_URL + "/anime.php")
  .then(res => {
    if(res.data){
      animes = $(res.data)(".an");
      loadNextShow();
    }
  })

async function loadShowData(title){
  res = await Axios.get(database[title].url)
  if(res.data){
    $body = $(res.data);
    database[title].description = $body("div.infodes2")[0].children[0].data;
    database[title].imageUrl = BASE_URL + $body("img.posteri")[0].attribs.src
    database[title].episodes = {};
    $body("a.infovan").each((i, e) => {
      const href = e.attribs.href;
      const number = href.split("&")[1].split("=")[1];
      database[title].episodes[number] = {
        number,
        url: BASE_URL + href
      };
    });
  }
}