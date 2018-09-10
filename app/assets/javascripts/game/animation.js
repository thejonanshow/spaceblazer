function load_animations(animations) {
  scene.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';

  animation_keys = Object.keys(animations);

  animation_keys.forEach(function(key) {
    for (i of range(1, animations[key].frame_count)) {
      frame_key = key + i;
      animations[key].frames.push({ key: frame_key });
      scene.load.image(frame_key, animations[key].path + i + '.png');
    };
  });
};

function create_animations(animations) {
  animation_keys = Object.keys(animations);

  animation_keys.forEach(function(key) {
    scene.anims.create({
      key: key,
      frames: animations[key].frames,
      frameRate: animations[key].frame_rate,
      repeat: animations[key].repeat
    });
  });
};
