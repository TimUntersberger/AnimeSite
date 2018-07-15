require("dotenv").load();

const express    = require("express");
const path       = require("path");
const server     = express();
const port       = process.env.PORT || 8080;
const router     = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

server.use(router);
server.use(express.static("static"));
server.set("view engine", "ejs");
server.set("views", "src");

server.listen(port, () => {
  console.log("Server started on port " + port);
});