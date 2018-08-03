const mongoose = require("mongoose");

const showSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  episodes: [{type: mongoose.Schema.Types.ObjectId, ref: "Episode"}]
});

module.exports = mongoose.model("Show", showSchema);