import * as AWS from "aws-sdk";

import { Database } from "./types";
import { SmartDevice } from "../smarthome/types";

import createLogger from "../../helper/logging";
const logger = createLogger("AWSDynamoDB");

export default class AWSDynamoDB implements Database {
  protected docClient: AWS.DynamoDB.DocumentClient;

  constructor(protected tableName: string) {
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  getDevicesForUser(userId: string): Promise<{ [key: string]: SmartDevice }> {
    return new Promise((resolve, reject) => {
      const table = this.tableName;

      const params = {
        TableName: table,
        Key: {
          userId: userId
        }
      };

      this.docClient.get(params, (err, data) => {
        if (!err && data && data.Item) {
          resolve(data.Item.devices);
        } else {
          logger.error(
            "Unable to read item. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        }
      });
    });
  }

  updateDeviceState(
    userId: string,
    deviceId: string,
    property: string,
    newValue: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const table = this.tableName;

      const params = {
        ExpressionAttributeNames: {
          "#P": "devices",
          "#D": deviceId,
          "#S": "state",
          "#AT": property
        },
        ExpressionAttributeValues: {
          ":v": newValue
        },
        Key: {
          userId: userId
        },
        ReturnValues: "NONE",
        TableName: table,
        UpdateExpression: "SET #P.#D.#S.#AT = :v"
      };

      this.docClient.update(params, err => {
        if (err) {
          logger.error(
            "Unable to read item. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  ensureUserExists(userId) {
    return new Promise((resolve, reject) => {
      const table = this.tableName;

      const params = {
        TableName: table,
        ConditionExpression: "attribute_not_exists(userId)",
        Item: {
          userId: userId,
          devices: {}
        }
      };

      this.docClient.put(params, err => {
        if (err) {
          if (err.code === "ConditionalCheckFailedException") {
            resolve();
          } else {
            logger.error(
              "Unable to read item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
            reject(err);
          }
        } else {
          resolve();
        }
      });
    });
  }

  async createNewDevice(userId, deviceId, primaryKey, deviceTraits) {
    await this.ensureUserExists(userId);

    const table = this.tableName;

    // TODO make initial values configurable
    const state = deviceTraits.reduce((prev, curr) => {
      if (curr === "on-off") {
        prev.on = true;
      } else if (curr === "brightness") {
        prev.brightness = 100;
      } else if (curr === "color-spectrum") {
        prev.color = "#ffffff;"
      } else {
        throw new Error(`Unknown device trait: ${curr}`);
      }
      return prev;
    }, {})

    const newValue = {
      deviceId,
      primaryKey,
      name: "Smart Light",
      state,
    };
    const params = {
      ExpressionAttributeNames: {
        "#P": "devices",
        "#D": deviceId
      },
      ExpressionAttributeValues: {
        ":v": newValue
      },
      Key: {
        userId: userId
      },
      ReturnValues: "NONE",
      TableName: table,
      UpdateExpression: "SET #P.#D = :v"
    };
    await this.docClient.update(params).promise();
  }
}
