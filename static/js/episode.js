const video = new Plyr("#player");

video.on("play", event => {
  document.getElementById("navbar").hidden = true;
});

video.on("pause", event => {
  document.getElementById("navbar").hidden = false;
});