import AzureIotHub from '../../../lib/service/iothub/AzureIotHub';

import { secrets } from '../../secrets';

jest.setTimeout(20000);

test.skip('createDeviceIdentity', async () => {
  const deviceId = '95';
  const service = new AzureIotHub(secrets.azureIotOwner.connectionString);
  const result = await service.createDeviceIdentity(deviceId);
  expect(result).not.toBeNull();
  console.log('azure device registration: ', result);
});
