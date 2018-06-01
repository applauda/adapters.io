import { Client, Registry } from "azure-iothub";
import { Message } from "azure-iot-common";

import { IotHubService } from "./types";

import createLogger from "../../helper/logging";
const logger = createLogger("AzureIotHub");

export default class AzureIotHub implements IotHubService {
  protected serviceClient: Client;
  protected registry: Registry;

  constructor(connectionString: string) {
    this.serviceClient = Client.fromConnectionString(connectionString);
    this.registry = Registry.fromConnectionString(connectionString);
  }

  handleResult(resolve) {
    return function printResult(err, res) {
      if (err) {
        logger.error(`c2d error: ${err.toString()}`);
      }
      if (res) {
        logger.info(`c2d status: ${res.constructor.name}`);
      }
      resolve(true);
    };
  }

  receiveFeedback() {
    return (err, receiver) => {
      receiver.on("message", msg => {
        logger.info("Feedback message:");
        logger.info(msg.getData().toString("utf-8"));
      });
    };
  }

  sendCloud2DeviceMessage(
    targetDevice: string,
    data: string
  ): Promise<boolean> {
    logger.info("sendC2D start");
    return new Promise(resolve => {
      this.serviceClient.open(err => {
        if (err) {
          logger.error(`Could not connect: ${err.message}`);
          resolve(false);
        } else {
          logger.info("Service client connected");
          this.serviceClient.getFeedbackReceiver(this.receiveFeedback());
          const message = new Message(data);
          message.ack = "full";
          message.messageId = `${new Date().getTime()}`;
          logger.info(`Sending message: ${message.getData()}`);
          this.serviceClient.send(
            targetDevice,
            message,
            this.handleResult(resolve)
          );
        }
      });
    });
  }

  createDeviceIdentity(deviceId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const device = { deviceId };
      this.registry.create(device, (err, deviceInfo) => {
        if (
          !err &&
          deviceInfo &&
          deviceInfo.authentication &&
          deviceInfo.authentication.symmetricKey
        ) {
          resolve(deviceInfo.authentication.symmetricKey.primaryKey);
        } else {
          reject(err);
        }
      });
    });
  }
}
