"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Adaptersio_1 = require("./Adaptersio");
exports.Adaptersio = Adaptersio_1.Adaptersio;
var LoginWithAmazon_1 = require("./service/auth/LoginWithAmazon");
var AWSDynamoDB_1 = require("./service/database/AWSDynamoDB");
var AzureIotHub_1 = require("./service/iothub/AzureIotHub");
var Auth = {
    LoginWithAmazon: LoginWithAmazon_1.default
};
exports.Auth = Auth;
var Database = {
    AWSDynamoDB: AWSDynamoDB_1.default
};
exports.Database = Database;
var IotHub = {
    AzureIotHub: AzureIotHub_1.default
};
exports.IotHub = IotHub;
