const video = new Plyr("#player");

video.on("play", event => {
  document.getElementById("navbar").hidden = true;
  document.getElementById("episode-nav").hidden = true;
});

video.on("pause", event => {
  document.getElementById("navbar").hidden = false;
  document.getElementById("episode-nav").hidden = false;
});