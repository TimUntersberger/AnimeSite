const express = require("express");
const server = express();
const router = express.Router();

server.use((req, res, next) => {
  res.append("Content-Type", "application/json");
  next();
})

router.get("/", (req, res) => {
});

router.get("/:show", (req, res) => {
});

router.get("/:show/:episode", (req, res) => {
});

server.use("/", router);
server.listen(8000, () => console.log("Server started"));

