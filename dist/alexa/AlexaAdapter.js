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
var AlexaAdapter = /** @class */ (function () {
    function AlexaAdapter(smartHomeService, authService, deviceTraits) {
        this.smartHomeService = smartHomeService;
        this.authService = authService;
        this.deviceTraits = deviceTraits;
    }
    AlexaAdapter.prototype.getUser = function (event, attributeName) {
        return this.authService.getUser("Bearer " + event.directive[attributeName].scope.token);
    };
    AlexaAdapter.prototype.handleDiscover = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, discovery, capabilities, payload, header;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(event, "payload")];
                    case 1:
                        userId = _a.sent();
                        return [4 /*yield*/, this.smartHomeService.discoverDevices(userId)];
                    case 2:
                        discovery = _a.sent();
                        capabilities = [{
                                type: "AlexaInterface",
                                interface: "Alexa",
                                version: "3"
                            }].concat(this.deviceTraits.map(function (trait) {
                            if (trait === "on-off") {
                                return {
                                    interface: "Alexa.PowerController",
                                    version: "3",
                                    type: "AlexaInterface",
                                    properties: {
                                        supported: [
                                            {
                                                name: "powerState"
                                            }
                                        ],
                                        retrievable: true
                                    }
                                };
                            }
                            else if (trait === "brightness") {
                                return {
                                    interface: "Alexa.BrightnessController",
                                    version: "3",
                                    type: "AlexaInterface",
                                    properties: {
                                        supported: [
                                            {
                                                name: "brightness"
                                            }
                                        ],
                                        retrievable: true
                                    }
                                };
                            }
                            else if (trait === "color-spectrum") {
                                return {
                                    interface: "Alexa.ColorController",
                                    version: "3",
                                    type: "AlexaInterface",
                                    properties: {
                                        supported: [
                                            {
                                                name: "color"
                                            }
                                        ],
                                        retrievable: true
                                    }
                                };
                            }
                            else {
                                throw new Error("Unsupported device trait: " + trait);
                            }
                        }));
                        payload = {
                            endpoints: lodash_1.values(discovery).map(function (dev) { return ({
                                endpointId: dev.deviceId,
                                manufacturerName: "applauda GmbH",
                                friendlyName: dev.name,
                                description: dev.name,
                                displayCategories: ["LIGHT"],
                                cookie: {},
                                capabilities: capabilities
                            }); })
                        };
                        header = event.directive.header;
                        header.name = "Discover.Response";
                        return [2 /*return*/, { event: { header: header, payload: payload } }];
                }
            });
        });
    };
    AlexaAdapter.prototype.handlePower = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, requestMethod, deviceId, powerResult, contextResult, responseHeader, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deviceTraits.includes("on-off")) {
                            throw new Error("Device trait on-off is not activated.");
                        }
                        return [4 /*yield*/, this.getUser(event, "endpoint")];
                    case 1:
                        userId = _a.sent();
                        requestMethod = event.directive.header.name;
                        deviceId = event.directive.endpoint.endpointId;
                        if (requestMethod === "TurnOn") {
                            powerResult = true;
                        }
                        else {
                            powerResult = false;
                        }
                        return [4 /*yield*/, this.smartHomeService.switchLight(userId, deviceId, powerResult)];
                    case 2:
                        _a.sent();
                        contextResult = {
                            properties: [
                                {
                                    namespace: "Alexa.PowerController",
                                    name: "powerState",
                                    value: powerResult ? "ON" : "OFF",
                                    timeOfSample: new Date().toJSON(),
                                    uncertaintyInMilliseconds: 50
                                }
                            ]
                        };
                        responseHeader = event.directive.header;
                        responseHeader.namespace = "Alexa";
                        responseHeader.name = "Response";
                        responseHeader.messageId += "-R";
                        response = {
                            context: contextResult,
                            event: {
                                header: responseHeader
                            },
                            endpoint: event.directive.endpoint,
                            payload: {}
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlexaAdapter.prototype.handleReportState = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, devices, state, devState, color, colorWrapped, colorHsv, responseHeader, properties;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(event, "endpoint")];
                    case 1:
                        userId = _a.sent();
                        devices = [event.directive.endpoint.endpointId];
                        return [4 /*yield*/, this.smartHomeService.getDeviceState(userId, devices)];
                    case 2:
                        state = _a.sent();
                        devState = state[event.directive.endpoint.endpointId];
                        color = devState.color;
                        colorWrapped = tinycolor(color);
                        colorHsv = colorWrapped.toHsv();
                        responseHeader = event.directive.header;
                        responseHeader.namespace = "Alexa";
                        responseHeader.name = "StateReport";
                        responseHeader.messageId += "-R";
                        properties = this.deviceTraits.map(function (trait) {
                            if (trait === "on-off") {
                                return {
                                    namespace: "Alexa.PowerController",
                                    name: "powerState",
                                    value: devState.on ? "ON" : "OFF",
                                    timeOfSample: new Date().toJSON(),
                                    uncertaintyInMilliseconds: 1000
                                };
                            }
                            else if (trait === "brightness") {
                                return {
                                    namespace: "Alexa.BrightnessController",
                                    name: "brightness",
                                    value: devState.brightness,
                                    timeOfSample: new Date().toJSON(),
                                    uncertaintyInMilliseconds: 1000
                                };
                            }
                            else if (trait === "color-spectrum") {
                                return {
                                    namespace: "Alexa.ColorController",
                                    name: "color",
                                    value: {
                                        hue: colorHsv.h,
                                        saturation: colorHsv.s,
                                        brightness: colorHsv.v
                                    },
                                    timeOfSample: new Date().toJSON(),
                                    uncertaintyInMilliseconds: 1000
                                };
                            }
                            else {
                                throw new Error("Unsupported device trait: " + trait);
                            }
                        });
                        return [2 /*return*/, {
                                context: {
                                    properties: properties
                                },
                                event: {
                                    header: responseHeader,
                                    endpoint: event.directive.endpoint,
                                    payload: {}
                                }
                            }];
                }
            });
        });
    };
    AlexaAdapter.prototype.handleSetBrightness = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, deviceId, brightness, responseHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deviceTraits.includes("brightness")) {
                            throw new Error("Device trait brightness is not activated.");
                        }
                        return [4 /*yield*/, this.getUser(event, "endpoint")];
                    case 1:
                        userId = _a.sent();
                        deviceId = event.directive.endpoint.endpointId;
                        brightness = event.directive.payload.brightness;
                        return [4 /*yield*/, this.smartHomeService.setBrightness(userId, deviceId, brightness)];
                    case 2:
                        _a.sent();
                        responseHeader = event.directive.header;
                        responseHeader.namespace = "Alexa";
                        responseHeader.name = "Response";
                        responseHeader.messageId += "-R";
                        return [2 /*return*/, {
                                context: {
                                    properties: [
                                        {
                                            namespace: "Alexa.BrightnessController",
                                            name: "brightness",
                                            value: brightness,
                                            timeOfSample: new Date().toJSON(),
                                            uncertaintyInMilliseconds: 1000
                                        }
                                    ]
                                },
                                event: {
                                    header: responseHeader,
                                    endpoint: event.directive.endpoint,
                                    payload: {}
                                }
                            }];
                }
            });
        });
    };
    AlexaAdapter.prototype.handleAdjustBrightness = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, deviceId, delta, states, currentBrightness, brightness, responseHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deviceTraits.includes("brightness")) {
                            throw new Error("Device trait brightness is not activated.");
                        }
                        return [4 /*yield*/, this.getUser(event, "endpoint")];
                    case 1:
                        userId = _a.sent();
                        deviceId = event.directive.endpoint.endpointId;
                        delta = event.directive.payload.brightnessDelta;
                        return [4 /*yield*/, this.smartHomeService.getDeviceState(userId, [
                                deviceId
                            ])];
                    case 2:
                        states = _a.sent();
                        currentBrightness = states[deviceId].brightness;
                        brightness = Math.max(0, Math.min(100, currentBrightness + delta));
                        return [4 /*yield*/, this.smartHomeService.setBrightness(userId, deviceId, brightness)];
                    case 3:
                        _a.sent();
                        responseHeader = event.directive.header;
                        responseHeader.namespace = "Alexa";
                        responseHeader.name = "Response";
                        responseHeader.messageId += "-R";
                        return [2 /*return*/, {
                                context: {
                                    properties: [
                                        {
                                            namespace: "Alexa.BrightnessController",
                                            name: "brightness",
                                            value: brightness,
                                            timeOfSample: new Date().toJSON(),
                                            uncertaintyInMilliseconds: 1000
                                        }
                                    ]
                                },
                                event: {
                                    header: responseHeader,
                                    endpoint: event.directive.endpoint,
                                    payload: {}
                                }
                            }];
                }
            });
        });
    };
    AlexaAdapter.prototype.handleSetColor = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, deviceId, color, colorWrapped, colorRGB, responseHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.deviceTraits.includes("color-spectrum")) {
                            throw new Error("Device trait color-spectrum is not activated.");
                        }
                        return [4 /*yield*/, this.getUser(event, "endpoint")];
                    case 1:
                        userId = _a.sent();
                        deviceId = event.directive.endpoint.endpointId;
                        color = event.directive.payload.color;
                        colorWrapped = tinycolor({
                            h: color.hue,
                            s: color.saturation,
                            v: color.brightness
                        });
                        colorRGB = colorWrapped.toHexString();
                        return [4 /*yield*/, this.smartHomeService.setColor(userId, deviceId, colorRGB)];
                    case 2:
                        _a.sent();
                        responseHeader = event.directive.header;
                        responseHeader.namespace = "Alexa";
                        responseHeader.name = "Response";
                        responseHeader.messageId += "-R";
                        return [2 /*return*/, {
                                context: {
                                    properties: [
                                        {
                                            namespace: "Alexa.ColorController",
                                            name: "color",
                                            value: color,
                                            timeOfSample: new Date().toJSON(),
                                            uncertaintyInMilliseconds: 1000
                                        }
                                    ]
                                },
                                event: {
                                    header: responseHeader,
                                    endpoint: event.directive.endpoint,
                                    payload: {}
                                }
                            }];
                }
            });
        });
    };
    AlexaAdapter.prototype.registerDevice = function (userId) {
        return this.smartHomeService.registerDevice(userId, this.deviceTraits);
    };
    return AlexaAdapter;
}());
exports.default = AlexaAdapter;
