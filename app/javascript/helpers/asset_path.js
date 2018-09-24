function assetPath(scene) {
  let path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';
  if (process.env.OFFLINE) {
    path = '/offline/';
  }
  return path;
}
export { assetPath };
