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
var logging_1 = require("../helper/logging");
var logger = logging_1.default('AlexaDispatcher');
var AlexaDispatcher = /** @class */ (function () {
    function AlexaDispatcher(adapter) {
        this.adapter = adapter;
    }
    AlexaDispatcher.prototype.dispatch = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var answer, answer, answer, answer, answer, answer, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info('Request event: ', JSON.stringify(event), JSON.stringify(context));
                        if (!(event && event.body && event.body.command === 'registerDevice')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adapter.registerDevice(event.body.payload.user)];
                    case 1:
                        answer = _a.sent();
                        context.succeed(answer);
                        return [3 /*break*/, 18];
                    case 2:
                        if (!(event.directive.header.namespace === 'Alexa.Discovery' &&
                            event.directive.header.name === 'Discover')) return [3 /*break*/, 4];
                        logger.info('Discover request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handleDiscover(event)];
                    case 3:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        return [3 /*break*/, 18];
                    case 4:
                        if (!(event.directive.header.namespace === 'Alexa.PowerController')) return [3 /*break*/, 7];
                        if (!(event.directive.header.name === 'TurnOn' ||
                            event.directive.header.name === 'TurnOff')) return [3 /*break*/, 6];
                        logger.info('TurnOn or TurnOff Request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handlePower(event)];
                    case 5:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 18];
                    case 7:
                        if (!(event.directive.header.namespace === 'Alexa.BrightnessController')) return [3 /*break*/, 12];
                        if (!(event.directive.header.name === 'SetBrightness')) return [3 /*break*/, 9];
                        logger.info('SetBrightness Request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handleSetBrightness(event)];
                    case 8:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        return [3 /*break*/, 11];
                    case 9:
                        if (!(event.directive.header.name === 'AdjustBrightness')) return [3 /*break*/, 11];
                        logger.info('AdjustBrightness Request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handleAdjustBrightness(event)];
                    case 10:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        _a.label = 11;
                    case 11: return [3 /*break*/, 18];
                    case 12:
                        if (!(event.directive.header.namespace === 'Alexa.ColorController')) return [3 /*break*/, 15];
                        if (!(event.directive.header.name === 'SetColor')) return [3 /*break*/, 14];
                        logger.info('SetColor Request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handleSetColor(event)];
                    case 13:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        _a.label = 14;
                    case 14: return [3 /*break*/, 18];
                    case 15:
                        if (!(event.directive.header.namespace === 'Alexa' &&
                            event.directive.header.name === 'ReportState')) return [3 /*break*/, 17];
                        logger.info('Report State Request', JSON.stringify(event));
                        return [4 /*yield*/, this.adapter.handleReportState(event)];
                    case 16:
                        answer = _a.sent();
                        logger.info('Request response', JSON.stringify(answer));
                        context.succeed(answer);
                        return [3 /*break*/, 18];
                    case 17:
                        logger.error("unknown event", event);
                        _a.label = 18;
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    return AlexaDispatcher;
}());
exports.default = AlexaDispatcher;
