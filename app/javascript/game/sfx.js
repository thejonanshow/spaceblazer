function addSfxMarkers(scene) {
  var markers = [
    { name: 'newplayer', start: 0, duration: 0.2, config: {} },
  ];

  markers.forEach(function(marker) {
    scene.sfx.addMarker(marker);
  });
};
export { addSfxMarkers };
