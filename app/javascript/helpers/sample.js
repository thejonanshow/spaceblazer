function sample() {
  return this[Math.floor(Math.random() * this.length)];
}
export { sample };
