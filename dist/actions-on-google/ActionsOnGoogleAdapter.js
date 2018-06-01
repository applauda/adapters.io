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
var tinycolor = require("tinycolor2");
var utils_1 = require("../helper/utils");
var ActionsOnGoogleAdapter = /** @class */ (function () {
    function ActionsOnGoogleAdapter(smartHomeService, authService, deviceTraits) {
        this.smartHomeService = smartHomeService;
        this.authService = authService;
        this.deviceTraits = deviceTraits;
    }
    ActionsOnGoogleAdapter.prototype.getUser = function (request) {
        return this.authService.getUser(request.headers.Authorization);
    };
    ActionsOnGoogleAdapter.prototype.handleSync = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, discovery, traits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(request)];
                    case 1:
                        userId = _a.sent();
                        return [4 /*yield*/, this.smartHomeService.discoverDevices(userId)];
                    case 2:
                        discovery = _a.sent();
                        traits = this.deviceTraits.map(function (trait) {
                            if (trait === "on-off") {
                                return "action.devices.traits.OnOff";
                            }
                            else if (trait === "brightness") {
                                return "action.devices.traits.Brightness";
                            }
                            else if (trait === "color-spectrum") {
                                return "action.devices.traits.ColorSpectrum";
                            }
                            else {
                                throw new Error("Unknown device trait: " + trait);
                            }
                        });
                        return [2 /*return*/, {
                                requestId: request.body.requestId,
                                payload: {
                                    agentUserId: userId,
                                    devices: lodash_1.values(discovery).map(function (dev) { return ({
                                        id: dev.deviceId,
                                        type: "action.devices.types.LIGHT",
                                        traits: traits,
                                        name: {
                                            name: dev.name
                                        },
                                        willReportState: false,
                                        attributes: {},
                                        deviceInfo: {
                                            manufacturer: "applauda GmbH",
                                            model: "sm1",
                                            hwVersion: "1.0",
                                            swVersion: "1.0"
                                        }
                                    }); })
                                }
                            }];
                }
            });
        });
    };
    ActionsOnGoogleAdapter.prototype.handleExecute = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var user, payload, response, commandPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(request)];
                    case 1:
                        user = _a.sent();
                        payload = request.body.inputs[0].payload;
                        response = {
                            requestId: request.body.requestId,
                            payload: {
                                commands: []
                            }
                        };
                        commandPromises = [];
                        payload.commands.forEach(function (_a) {
                            var devices = _a.devices, execution = _a.execution;
                            devices.forEach(function (device) {
                                execution.forEach(function (command) {
                                    if (command.command === "action.devices.commands.OnOff") {
                                        if (!_this.deviceTraits.includes("on-off")) {
                                            throw new Error("Device trait on-off is not activated.");
                                        }
                                        commandPromises.push(_this.smartHomeService.switchLight(user, device.id, command.params.on));
                                        response.payload.commands.push({
                                            ids: [device.id],
                                            status: "SUCCESS",
                                            states: {
                                                online: true,
                                                on: command.params.on
                                            }
                                        });
                                    }
                                    else if (command.command === "action.devices.commands.BrightnessAbsolute") {
                                        if (!_this.deviceTraits.includes("brightness")) {
                                            throw new Error("Device trait brightness is not activated.");
                                        }
                                        commandPromises.push(_this.smartHomeService.setBrightness(user, device.id, command.params.brightness));
                                        response.payload.commands.push({
                                            ids: [device.id],
                                            status: "SUCCESS",
                                            states: {
                                                online: true,
                                                brightness: command.params.brightness
                                            }
                                        });
                                    }
                                    else if (command.command === "action.devices.commands.ColorAbsolute") {
                                        if (!_this.deviceTraits.includes("color-spectrum")) {
                                            throw new Error("Device trait color-spectrum is not activated.");
                                        }
                                        var colorStr = utils_1.colors.intToHexString(command.params.color.spectrumRGB);
                                        commandPromises.push(_this.smartHomeService.setColor(user, device.id, colorStr));
                                        response.payload.commands.push({
                                            ids: [device.id],
                                            status: "SUCCESS",
                                            states: {
                                                online: true,
                                                color: {
                                                    spectrumRGB: command.params.color.spectrumRGB
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                        });
                        return [4 /*yield*/, Promise.all(commandPromises)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ActionsOnGoogleAdapter.prototype.handleQuery = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var user, devices, states;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(request)];
                    case 1:
                        user = _a.sent();
                        devices = request.body.inputs[0].payload.devices.map(function (d) { return d.id; });
                        return [4 /*yield*/, this.smartHomeService.getDeviceState(user, devices)];
                    case 2:
                        states = _a.sent();
                        return [2 /*return*/, {
                                requestId: request.body.requestId,
                                payload: {
                                    devices: lodash_1.mapValues(states, function (dev) {
                                        var color = dev.color;
                                        var colorWrapped = tinycolor(color);
                                        var spectrumRGB = 999; // TODO
                                        var initial = {
                                            online: true,
                                        };
                                        var state = _this.deviceTraits.reduce(function (prev, curr) {
                                            if (curr === "on-off") {
                                                prev.on = dev.on;
                                            }
                                            else if (curr === "brightness") {
                                                prev.brightness = dev.brightness;
                                            }
                                            else if (curr === "color-spectrum") {
                                                prev.color = {
                                                    name: colorWrapped.toName() || "unknown",
                                                    spectrumRGB: spectrumRGB,
                                                };
                                            }
                                            else {
                                                throw new Error("Unknown device trait: " + curr);
                                            }
                                            return prev;
                                        }, initial);
                                        return state;
                                    })
                                }
                            }];
                }
            });
        });
    };
    return ActionsOnGoogleAdapter;
}());
exports.default = ActionsOnGoogleAdapter;
