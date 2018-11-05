function resize() {
  var canvas = document.querySelector("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}

window.onload = function() {
  resize();
  window.addEventListener("resize", resize, false);
}
