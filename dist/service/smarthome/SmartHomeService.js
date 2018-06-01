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
var lodash_1 = require("lodash");
var logging_1 = require("../../helper/logging");
var logger = logging_1.default("SmartHomeService");
var SmartHomeServiceImpl = /** @class */ (function () {
    function SmartHomeServiceImpl(devicesRepository, iotHubService) {
        this.devicesRepository = devicesRepository;
        this.iotHubService = iotHubService;
    }
    SmartHomeServiceImpl.prototype.discoverDevices = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var devices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devicesRepository.getDevicesForUser(userId)];
                    case 1:
                        devices = _a.sent();
                        return [2 /*return*/, devices];
                }
            });
        });
    };
    SmartHomeServiceImpl.prototype.switchLight = function (userId, deviceId, turnOn) {
        return __awaiter(this, void 0, void 0, function () {
            var onOff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info("Device command: Switch Light " + deviceId + " to " + turnOn);
                        onOff = turnOn ? "1" : "0";
                        return [4 /*yield*/, Promise.all([
                                this.iotHubService.sendCloud2DeviceMessage(deviceId, "s" + onOff),
                                this.devicesRepository.updateDeviceState(userId, deviceId, "on", turnOn)
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SmartHomeServiceImpl.prototype.setBrightness = function (userId, deviceId, brightness) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info("Device command: Set Brightness for " + deviceId + " to " + brightness);
                        return [4 /*yield*/, Promise.all([
                                this.iotHubService.sendCloud2DeviceMessage(deviceId, "b" + brightness),
                                this.devicesRepository.updateDeviceState(userId, deviceId, "brightness", brightness)
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SmartHomeServiceImpl.prototype.setColor = function (userId, deviceId, color) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info("Device command: Set Color for " + deviceId + " to " + color);
                        return [4 /*yield*/, Promise.all([
                                this.iotHubService.sendCloud2DeviceMessage(deviceId, "c" + color),
                                this.devicesRepository.updateDeviceState(userId, deviceId, "color", color)
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    SmartHomeServiceImpl.prototype.getDeviceState = function (userId, deviceIds) {
        return __awaiter(this, void 0, void 0, function () {
            var devices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devicesRepository.getDevicesForUser(userId)];
                    case 1:
                        devices = _a.sent();
                        return [2 /*return*/, lodash_1.mapValues(lodash_1.pick(devices, deviceIds), function (dev) { return dev.state; })];
                }
            });
        });
    };
    SmartHomeServiceImpl.prototype.registerDevice = function (userId, deviceTraits) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueId, primaryKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uniqueId = Math.random()
                            .toString(36)
                            .substring(2) + new Date().getTime().toString(36);
                        return [4 /*yield*/, this.iotHubService.createDeviceIdentity(uniqueId)];
                    case 1:
                        primaryKey = _a.sent();
                        // create meta data object in our device db
                        return [4 /*yield*/, this.devicesRepository.createNewDevice(userId, uniqueId, primaryKey, deviceTraits)];
                    case 2:
                        // create meta data object in our device db
                        _a.sent();
                        return [2 /*return*/, {
                                primaryKey: primaryKey,
                                deviceId: uniqueId
                            }];
                }
            });
        });
    };
    return SmartHomeServiceImpl;
}());
exports.default = SmartHomeServiceImpl;
