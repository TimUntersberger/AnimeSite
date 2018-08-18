const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const server = express();
const router = express.Router();
const { insertEpisode, getEpisode, getAnime, getAllAnimes } = require(path.join(__dirname, "../repository/save_anime"))

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

router.get("/authenticate", (req, res) => {
  const { password } = req.query;
  if(password === "test"){
    res.cookie("authorization", "test");
  }
  else res.status(403);
  res.redirect(req.headers.referer);
});

router.use((req, res, next) => {
  res.append("Content-Type", "application/json");
  const token = req.get("Authorization");
	if(token && token.split(" ")[1] === "test")
		next();
	else
		res.status(403).end();
})

router.get("/", (req, res) => { getAllAnimes().then(animes => res.json(animes)).catch(console.log) });

router.post("/:show/:episode", async (req, res) => {
	const { show, episode } = req.params;
  const { url } = req.body;

	if(show && episode && url){
    await insertEpisode(show, { url, episodeNumber: episode })
    res.status(201).end();
  }
  else res.status(400).end()
});

server.use("/", router);
server.listen(8000, () => console.log("Server started"));

