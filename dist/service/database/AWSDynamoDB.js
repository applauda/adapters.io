"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var logging_1 = require("../../helper/logging");
var logger = logging_1.default("AWSDynamoDB");
var AWSDynamoDB = /** @class */ (function () {
    function AWSDynamoDB(tableName) {
        this.tableName = tableName;
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }
    AWSDynamoDB.prototype.getDevicesForUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var table = _this.tableName;
            var params = {
                TableName: table,
                Key: {
                    userId: userId
                }
            };
            _this.docClient.get(params, function (err, data) {
                if (!err && data && data.Item) {
                    resolve(data.Item.devices);
                }
                else {
                    logger.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                }
            });
        });
    };
    AWSDynamoDB.prototype.updateDeviceState = function (userId, deviceId, property, newValue) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var table = _this.tableName;
            var params = {
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
            _this.docClient.update(params, function (err) {
                if (err) {
                    logger.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    AWSDynamoDB.prototype.ensureUserExists = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var table = _this.tableName;
            var params = {
                TableName: table,
                ConditionExpression: "attribute_not_exists(userId)",
                Item: {
                    userId: userId,
                    devices: {}
                }
            };
            _this.docClient.put(params, function (err) {
                if (err) {
                    if (err.code === "ConditionalCheckFailedException") {
                        resolve();
                    }
                    else {
                        logger.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                        reject(err);
                    }
                }
                else {
                    resolve();
                }
            });
        });
    };
    AWSDynamoDB.prototype.createNewDevice = function (userId, deviceId, primaryKey, deviceTraits) {
        return __awaiter(this, void 0, void 0, function () {
            var table, state, newValue, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureUserExists(userId)];
                    case 1:
                        _a.sent();
                        table = this.tableName;
                        state = deviceTraits.reduce(function (prev, curr) {
                            if (curr === "on-off") {
                                prev.on = true;
                            }
                            else if (curr === "brightness") {
                                prev.brightness = 100;
                            }
                            else if (curr === "color-spectrum") {
                                prev.color = "#ffffff;";
                            }
                            else {
                                throw new Error("Unknown device trait: " + curr);
                            }
                            return prev;
                        }, {});
                        newValue = {
                            deviceId: deviceId,
                            primaryKey: primaryKey,
                            name: "Smart Light",
                            state: state,
                        };
                        params = {
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
                        return [4 /*yield*/, this.docClient.update(params).promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AWSDynamoDB;
}());
exports.default = AWSDynamoDB;
