require("dotenv").load();
const express = require("express");
const cookieParser = require("cookie-parser");
const path    = require("path");
const server  = express();
const port    = process.env.PORT || 8080;
const router  = express.Router();
const fs      = require("fs");
const mongoose = require("mongoose");
const Show = require(path.join(__dirname, "models/show"));
const { getAllAnimes, getAnime } = require(path.join(__dirname, "/repository/save_anime"));

mongoose.connect(process.env.MONGO_DB_HOST, {
  useNewUrlParser: true
});

server.use(cookieParser());
server.use("/static", express.static("static"));
server.use(router);
server.set("view engine", "ejs");
server.set("views", "src");

router.get("/", async (req, res) => {
  res.render("pages/home", { location: "/"});
});

router.use((req, res, next) => {
	const token = req.cookies.authorization;
	if(token && token == "test")  
		next();
	else
		res.render("pages/authenticate", { location: req.originalUrl, actionUrl: `${process.env.API_URL || "http://localhost:8000"}/authenticate` });
});

router.get("/shows", (req, res) => {
  getAllAnimes().then(animes =>
    res.render("pages/shows", { location: "/shows", animes })
  );
});

router.get("/:title", (req, res) => {
  getAnime(req.params.title).then(show => {
    debugger;
    res.render("pages/show", { location: "", show });
  });
});

router.get("/:title/:episodeNumber", async (req, res) => {
  const { title, episodeNumber } = req.params;
  const show = await Show.findOne({ title }).populate("episodes").exec();
  if(show){
    const episode = show.episodes.find(e => e.episodeNumber == episodeNumber);
   if(episode){
      const hasNext = show.episodes.some(e => e.episodeNumber == parseInt(episodeNumber) + 1);
      const hasPrevious = show.episodes.some(e => e.episodeNumber == parseInt(episodeNumber) - 1);
      res.render("pages/episode", { 
        location: "",
        show,
        episode: {
          url: episode.url,
          episodeNumber: episode.episodeNumber,
          hasNext,
          hasPrevious
        }
      });
    }
    else res.status(404).send("Episode not found");
  }
  else res.status(404).send("Show not found");
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});
