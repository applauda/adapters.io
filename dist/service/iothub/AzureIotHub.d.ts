import { Client, Registry } from "azure-iothub";
import { IotHubService } from "./types";
export default class AzureIotHub implements IotHubService {
    protected serviceClient: Client;
    protected registry: Registry;
    constructor(connectionString: string);
    handleResult(resolve: any): (err: any, res: any) => void;
    receiveFeedback(): (err: any, receiver: any) => void;
    sendCloud2DeviceMessage(targetDevice: string, data: string): Promise<boolean>;
    createDeviceIdentity(deviceId: string): Promise<string>;
}
