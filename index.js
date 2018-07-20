require("dotenv").load();

const express = require("express");
const path    = require("path");
const server  = express();
const port    = process.env.PORT || 8080;
const router  = express.Router();
const fs      = require("fs");

server.use(router);
server.use("/static", express.static("static"));
server.set("view engine", "ejs");
server.set("views", "src");

const database = JSON.parse(fs.readFileSync("api/database.json"));


router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/:show/:episode", (req, res) => {
  const { show, episode } = req.params;
  if(database[show] && database[show].episodes[episode]){
    res.render("pages/episode", {
      episode: database[show].episodes[episode]
    });
  }
  res.status(404).end();
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});