const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const server = express();
const router = express.Router();
const { insertEpisode, getEpisode, getAnime, getAllAnimes } = require(path.join(__dirname, "../repository/save_anime"))

server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.use((req, res, next) => {
  res.append("Content-Type", "application/json");
  next();
})

router.get("/", (req, res) => { getAllAnimes().then(animes => res.json(animes)).catch(console.log) });
router.post("/:show/:episode", (req, res) => {
	const { show, episode } = req.params;
	const { url } = req.body;

	if(show && episode && url){
		insertEpisode(show, { url, episodeNumber: episode })
	}

	res.end();
});

server.use("/", router);
server.listen(8000, () => console.log("Server started"));

