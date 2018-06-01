import { Adaptersio } from "./Adaptersio";
import { AdaptersioConfig } from "./types";

import LoginWithAmazon from "./service/auth/LoginWithAmazon";
import AWSDynamoDB from "./service/database/AWSDynamoDB";
import AzureIotHub from "./service/iothub/AzureIotHub";
import { DeviceTrait } from "./service/smarthome/types";

const Auth = {
  LoginWithAmazon
};
const Database = {
  AWSDynamoDB
};
const IotHub = {
  AzureIotHub
};

export { Auth, Database, IotHub, Adaptersio, AdaptersioConfig, DeviceTrait };
