require("dotenv").load();
const mongoose = require("mongoose");
const Show = require("../models/show");
const Episode = require("../models/episode");

mongoose.connect(process.env.MONGO_DB_HOST, {
  useNewUrlParser: true
});

module.exports = {
  insertEpisode: function (title, episode, cb){
    const show = Show.find({ title });
    episode = new Episode({
      _id: new mongoose.Types.ObjectId(),
      episodeNumber: episode.episodeNumber,
      url: episode.url
    });
    show.populate("episodes").then(result => {
      if(result.length === 0) {
        episode.save();
        new Show({
          _id: new mongoose.Types.ObjectId(),
          description: "description",
          title,
          episodes: [episode._id]
        }).save();
      }
      else {
        episode
          .save()
          .then(result => {
            show.episodes.push(episode._id)
          })
          .catch(err => {
            // dup episode
            if(cb)
              cb(err);
          });
      }
    })
  }
}