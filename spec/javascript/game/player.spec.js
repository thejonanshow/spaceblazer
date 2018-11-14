import Player from 'game/player';

test('stores game specific state in state', () => {
  expect((new Player).state).toBeDefined();
});

xtest("joining a game doesn't allow movement or firing until game starts", () => {
});
