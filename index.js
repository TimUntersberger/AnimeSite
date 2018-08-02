require("dotenv").load();
const express = require("express");
const path    = require("path");
const server  = express();
const port    = process.env.PORT || 8080;
const router  = express.Router();
const fs      = require("fs");
const mongoose = require("mongoose");
const Show = require(path.join(__dirname, "models/show"));
const { getAllAnimes } = require(path.join(__dirname, "/repository/save_anime"));

mongoose.connect(process.env.MONGO_DB_HOST, {
  useNewUrlParser: true
});

server.use(router);
server.use("/static", express.static("static"));
server.set("view engine", "ejs");
server.set("views", "src");

router.get("/", async (req, res) => {
  res.render("pages/home");
});

router.get("/shows", (req, res) => {
  getAllAnimes().then(animes => res.render("pages/shows", animes));
});

router.get("/:title/:episodeNumber", async (req, res) => {
  // const { title, episodeNumber } = req.params;
  // const show = await Show.findOne({ title }).populate("episodes").exec();
  // if(show){
  //   const episode = show.episodes.find(e => e.episodeNumber == episodeNumber);
  //   if(episode){
  //     res.render("pages/episode", { 
  //       episode: {
  //         title: show.title,
  //         url: episode.url,
  //         episodeNumber: episode.episodeNumber
  //       }
  //     });
  //   }
  //   else res.status(404).send("Episode not found");
  // }
  // else res.status(404).send("Show not found");
  res.render("pages/episode", {
    episode: {
      title: "Boku no Hero Academia",
      url: "https://www.dropbox.com/s/79l4k2y9gxidtbr/04.mp4?raw=1",
      episodeNumber: 1
    }
  });
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});