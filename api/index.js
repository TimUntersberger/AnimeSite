const fs = require("fs");
const express = require("express");

const database = JSON.parse(fs.readFileSync("api/database.json"));
const server = express();
const router = express.Router();

server.use((req, res, next) => {
  res.append("Content-Type", "application/json");
  next();
})

router.get("/", (req, res) => {
  if(req.query.start && req.query.end){
    const temp = {};
    Object.keys(database).slice(req.query.start - 1, req.query.end - 1).forEach(key => {
      temp[key] = database[key];
    });
    res.json(temp);
  }
  else res.json(database);
});

router.get("/:show", (req, res) => {
  if(req.params.show){
    const show = database[req.params.show];
    if(show){
      res.json(show);
    }
  }
});

router.get("/:show/:episode", (req, res) => {
  if(req.params.show && req.params.episode){
    const show = database[req.params.show];
    if(show){
      const episode = show.episodes[req.params.episode];
      if(episode){
        res.json(episode);
      }
      res.end();
    }
    res.end();
  }
});

server.use("/", router);
server.listen(8000, () => console.log("Server started"));

