import { SmartDevice } from '../smarthome/types';
import { DeviceTrait } from '../..';

export type Database = {
  getDevicesForUser(userId: string): Promise<{[key: string]: SmartDevice}>;
  updateDeviceState(userId: string, deviceId: string, property: string, value: any): Promise<void>;
  createNewDevice(userId: string, uniqueId: string, primaryKey: string, deviceTraits: DeviceTrait[]): Promise<void>;
};
