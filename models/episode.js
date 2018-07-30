const mongoose = require("mongoose");

const episodeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  episodeNumber: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Episode", episodeSchema);