import { pick, mapValues } from "lodash";

import { Database } from "../database/types";
import {
  SmartHomeService,
  LightBrightness,
  RGBHexString,
  SmartDeviceState,
  SmartDevice,
  DeviceTrait
} from "./types";

import { IotHubService } from "../iothub/types";

import createLogger from "../../helper/logging";
const logger = createLogger("SmartHomeService");

export default class SmartHomeServiceImpl implements SmartHomeService {
  constructor(
    protected devicesRepository: Database,
    protected iotHubService: IotHubService
  ) {}

  async discoverDevices(userId: string) {
    const devices = await this.devicesRepository.getDevicesForUser(userId);
    return devices;
  }

  async switchLight(userId: string, deviceId: string, turnOn: boolean) {
    logger.info(`Device command: Switch Light ${deviceId} to ${turnOn}`);
    const onOff = turnOn ? "1" : "0";
    await Promise.all([
      this.iotHubService.sendCloud2DeviceMessage(deviceId, `s${onOff}`),
      this.devicesRepository.updateDeviceState(userId, deviceId, "on", turnOn)
    ]);
  }

  async setBrightness(
    userId: string,
    deviceId: string,
    brightness: LightBrightness
  ) {
    logger.info(
      `Device command: Set Brightness for ${deviceId} to ${brightness}`
    );
    await Promise.all([
      this.iotHubService.sendCloud2DeviceMessage(deviceId, `b${brightness}`),
      this.devicesRepository.updateDeviceState(userId, deviceId, "brightness", brightness)
    ]);
  }

  async setColor(userId: string, deviceId: string, color: RGBHexString) {
    logger.info(`Device command: Set Color for ${deviceId} to ${color}`);
    await Promise.all([
      this.iotHubService.sendCloud2DeviceMessage(deviceId, `c${color}`),
      this.devicesRepository.updateDeviceState(userId, deviceId, "color", color)
    ]);
    return true;
  }

  async getDeviceState(userId: string, deviceIds: string[]) {
    const devices = await this.devicesRepository.getDevicesForUser(userId);
    return <{ [key: string]: SmartDeviceState }>mapValues(
      pick(devices, deviceIds),
      dev => dev.state
    );
  }

  async registerDevice(userId: string, deviceTraits: DeviceTrait[]) {
    // generate new device unique id
    const uniqueId =
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36);

    // tell azure
    const primaryKey = await this.iotHubService.createDeviceIdentity(uniqueId);

    // create meta data object in our device db
    await this.devicesRepository.createNewDevice(userId, uniqueId, primaryKey, deviceTraits);

    return {
      primaryKey,
      deviceId: uniqueId
    };
  }
}
