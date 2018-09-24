import Enemy from 'game/enemy'

test('stores game specific state in state', () => {
  expect((new Enemy).state).toBeDefined();
});
