import Device from 'game/device'

test('stores game specific state in state', () => {
  expect((new Device).state).toBeDefined();
});
