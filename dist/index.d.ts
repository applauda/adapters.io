import { Adaptersio } from "./Adaptersio";
import { AdaptersioConfig } from "./types";
import LoginWithAmazon from "./service/auth/LoginWithAmazon";
import AWSDynamoDB from "./service/database/AWSDynamoDB";
import AzureIotHub from "./service/iothub/AzureIotHub";
import { DeviceTrait } from "./service/smarthome/types";
declare const Auth: {
    LoginWithAmazon: typeof LoginWithAmazon;
};
declare const Database: {
    AWSDynamoDB: typeof AWSDynamoDB;
};
declare const IotHub: {
    AzureIotHub: typeof AzureIotHub;
};
export { Auth, Database, IotHub, Adaptersio, AdaptersioConfig, DeviceTrait };
