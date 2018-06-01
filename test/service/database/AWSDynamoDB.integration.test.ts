import AWSDynamoDB from '../../../lib/service/database/AWSDynamoDB';

import { secrets, setAWSConfig } from '../../secrets';

jest.setTimeout(30000);

const testUserId = '999';
const testDeviceId = '888';

beforeAll(() => {
  setAWSConfig();
});

test.skip('get devices', async () => {
  const service = new AWSDynamoDB(secrets.dynamoDB.tableName);
  const result = await service.getDevicesForUser(testUserId);

  expect(Object.getOwnPropertyNames(result).length).toBe(1);
  expect(result[testDeviceId].deviceId).toBe(testDeviceId);
  expect(result[testDeviceId].name).toBe('Smart Light');
});

test.skip('update single state property', async () => {
  const user = testUserId;
  const deviceId = testDeviceId;

  const service = new AWSDynamoDB(secrets.dynamoDB.tableName);
  const result = await service.getDevicesForUser(user);

  const current = result[testDeviceId].state.brightness;
  let newValue = current + 10;
  if (newValue > 100) {
    newValue = 1;
  }

  expect(current).toBeDefined();
  expect(result[testDeviceId].deviceId).toBe(testDeviceId);

  await service.updateDeviceState(user, deviceId, 'brightness', newValue);
  const result2 = await service.getDevicesForUser(user);
  expect(result2[testDeviceId].deviceId).toBe(testDeviceId);
  expect(result2[testDeviceId].state.brightness).toBe(newValue);
});

test.skip('ensureUserExists', async () => {
  const service = new AWSDynamoDB(secrets.dynamoDB.tableName);

  const user = testUserId;
  await service.ensureUserExists(user);
});

test.skip('createDevice', async () => {
  const service = new AWSDynamoDB(secrets.dynamoDB.tableName);

  const user = testUserId;
  const device = testDeviceId;

  await service.createNewDevice(user, device, '000-111-222', ["on-off"]);
});
