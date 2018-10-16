import Game from 'game/game';

test('stores game specific state in state', () => {
  expect((new Game).state).toBeDefined();
});
