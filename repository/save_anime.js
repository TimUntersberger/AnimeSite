require("dotenv").load();
const mongoose = require("mongoose");
const Show = require("../models/show");
const slugify = require("slugify");
const Kitsu = require("kitsu/node");
const KitsuApi = new Kitsu();
const Episode = require("../models/episode");

mongoose.connect(process.env.MONGO_DB_HOST, {
  useNewUrlParser: true
});

module.exports = {
  getAllAnimes: function(){
    return Show.find().populate("episodes");
  },
  getAnime: function(title){
    return Show.findOne({ title }).populate("episodes");
  },
  insertEpisode: async function (title, episode, cb){
    episode = new Episode({
      _id: new mongoose.Types.ObjectId(),
      episodeNumber: episode.episodeNumber,
      url: episode.url
    });
    let show = await Show.findOne({ title });
    if(!show){
      const res = await KitsuApi.get("anime", {
        filter: {
          slug: slugify(title, { lower: true })
        }
      });
      const anime = res.data[0];
      show = new Show({
        _id: new mongoose.Types.ObjectId(),
        posterImageUrl: anime.posterImage.small,
        coverImageUrl: anime.coverImage.tiny,
        description: anime.synopsis,
        title,
        episodes: [episode.id]
      });
    }
    else {
      show.episodes.push(episode.id);
    }
    episode.save();
    return show.save();
  }
}