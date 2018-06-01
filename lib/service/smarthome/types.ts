export type DeviceTrait = "on-off" | "brightness" | "color-spectrum";

export type SmartDevice = {
  deviceId: string,
  name: string,
  state: SmartDeviceState,
};

/**
 * in the format: #RRGGBB
 */
export type RGBHexString = string;

/**
 * 0-100
 */
export type LightBrightness = number;

export type SmartDeviceState = {
  on: boolean,
  color: RGBHexString,
  brightness: LightBrightness,
};

export type DeviceRegistration = {
  primaryKey: string,
  deviceId: string,
};

export interface SmartHomeService {
  discoverDevices(userId: string): Promise<{[key: string]: SmartDevice}>;
  switchLight(userId: string, deviceId: string, power: boolean): void;
  setBrightness(userId: string, deviceId: string, brightness: LightBrightness): void;
  setColor(userId: string, deviceId: string, color: RGBHexString): Promise<boolean>;
  getDeviceState(userId: string, deviceIds: string[]): Promise<{[key: string]: SmartDeviceState}>;
  registerDevice(userId: string, deviceTraits: DeviceTrait[]): Promise<DeviceRegistration>;
}
