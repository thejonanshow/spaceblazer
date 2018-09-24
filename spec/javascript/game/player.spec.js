import Player from 'game/player';

test('stores game specific state in state', () => {
  expect((new Player).state).toBeDefined();
});
