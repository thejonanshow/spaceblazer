import Game from 'game';

test('stores game specific state in state', () => {
  expect((new Game).state).toBeDefined();
});
