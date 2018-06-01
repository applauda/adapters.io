export type IotHubService = {
  sendCloud2DeviceMessage(deviceId: string, message: string): Promise<boolean>;
  createDeviceIdentity(uniqueId: string): Promise<string>;
};
