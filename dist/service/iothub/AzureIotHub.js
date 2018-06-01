"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var azure_iothub_1 = require("azure-iothub");
var azure_iot_common_1 = require("azure-iot-common");
var logging_1 = require("../../helper/logging");
var logger = logging_1.default("AzureIotHub");
var AzureIotHub = /** @class */ (function () {
    function AzureIotHub(connectionString) {
        this.serviceClient = azure_iothub_1.Client.fromConnectionString(connectionString);
        this.registry = azure_iothub_1.Registry.fromConnectionString(connectionString);
    }
    AzureIotHub.prototype.handleResult = function (resolve) {
        return function printResult(err, res) {
            if (err) {
                logger.error("c2d error: " + err.toString());
            }
            if (res) {
                logger.info("c2d status: " + res.constructor.name);
            }
            resolve(true);
        };
    };
    AzureIotHub.prototype.receiveFeedback = function () {
        return function (err, receiver) {
            receiver.on("message", function (msg) {
                logger.info("Feedback message:");
                logger.info(msg.getData().toString("utf-8"));
            });
        };
    };
    AzureIotHub.prototype.sendCloud2DeviceMessage = function (targetDevice, data) {
        var _this = this;
        logger.info("sendC2D start");
        return new Promise(function (resolve) {
            _this.serviceClient.open(function (err) {
                if (err) {
                    logger.error("Could not connect: " + err.message);
                    resolve(false);
                }
                else {
                    logger.info("Service client connected");
                    _this.serviceClient.getFeedbackReceiver(_this.receiveFeedback());
                    var message = new azure_iot_common_1.Message(data);
                    message.ack = "full";
                    message.messageId = "" + new Date().getTime();
                    logger.info("Sending message: " + message.getData());
                    _this.serviceClient.send(targetDevice, message, _this.handleResult(resolve));
                }
            });
        });
    };
    AzureIotHub.prototype.createDeviceIdentity = function (deviceId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var device = { deviceId: deviceId };
            _this.registry.create(device, function (err, deviceInfo) {
                if (!err &&
                    deviceInfo &&
                    deviceInfo.authentication &&
                    deviceInfo.authentication.symmetricKey) {
                    resolve(deviceInfo.authentication.symmetricKey.primaryKey);
                }
                else {
                    reject(err);
                }
            });
        });
    };
    return AzureIotHub;
}());
exports.default = AzureIotHub;
