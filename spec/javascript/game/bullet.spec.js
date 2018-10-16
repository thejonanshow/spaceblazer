import Bullet from 'game/bullet';

test('stores game specific state in state', () => {
  expect((new Bullet).state).toBeDefined();
});
