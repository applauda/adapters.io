import * as AWS from "aws-sdk";
import { Database } from "./types";
import { SmartDevice } from "../smarthome/types";
export default class AWSDynamoDB implements Database {
    protected tableName: string;
    protected docClient: AWS.DynamoDB.DocumentClient;
    constructor(tableName: string);
    getDevicesForUser(userId: string): Promise<{
        [key: string]: SmartDevice;
    }>;
    updateDeviceState(userId: string, deviceId: string, property: string, newValue: any): Promise<void>;
    ensureUserExists(userId: any): Promise<{}>;
    createNewDevice(userId: any, deviceId: any, primaryKey: any, deviceTraits: any): Promise<void>;
}
