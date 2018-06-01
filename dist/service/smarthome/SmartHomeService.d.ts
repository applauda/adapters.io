import { Database } from "../database/types";
import { SmartHomeService, LightBrightness, RGBHexString, SmartDeviceState, SmartDevice, DeviceTrait } from "./types";
import { IotHubService } from "../iothub/types";
export default class SmartHomeServiceImpl implements SmartHomeService {
    protected devicesRepository: Database;
    protected iotHubService: IotHubService;
    constructor(devicesRepository: Database, iotHubService: IotHubService);
    discoverDevices(userId: string): Promise<{
        [key: string]: SmartDevice;
    }>;
    switchLight(userId: string, deviceId: string, turnOn: boolean): Promise<void>;
    setBrightness(userId: string, deviceId: string, brightness: LightBrightness): Promise<void>;
    setColor(userId: string, deviceId: string, color: RGBHexString): Promise<boolean>;
    getDeviceState(userId: string, deviceIds: string[]): Promise<{
        [key: string]: SmartDeviceState;
    }>;
    registerDevice(userId: string, deviceTraits: DeviceTrait[]): Promise<{
        primaryKey: string;
        deviceId: string;
    }>;
}
