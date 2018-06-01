"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AlexaDispatcher_1 = require("./alexa/AlexaDispatcher");
var ActionsOnGoogleDispatcher_1 = require("./actions-on-google/ActionsOnGoogleDispatcher");
var AlexaAdapter_1 = require("./alexa/AlexaAdapter");
var SmartHomeService_1 = require("./service/smarthome/SmartHomeService");
var ActionsOnGoogleAdapter_1 = require("./actions-on-google/ActionsOnGoogleAdapter");
var Adaptersio = /** @class */ (function () {
    function Adaptersio(config) {
        this.config = config;
        var smartHomeService = new SmartHomeService_1.default(config.database, config.iotHub);
        switch (config.adapter) {
            case "alexa":
                this.dispatcher = new AlexaDispatcher_1.default(new AlexaAdapter_1.default(smartHomeService, config.auth, config.deviceTraits));
                break;
            case "actions-on-google":
                this.dispatcher = new ActionsOnGoogleDispatcher_1.default(new ActionsOnGoogleAdapter_1.default(smartHomeService, config.auth, config.deviceTraits));
                break;
        }
    }
    Adaptersio.prototype.handleAwsRequest = function (event, context) {
        return this.dispatcher.dispatch(event, context);
    };
    return Adaptersio;
}());
exports.Adaptersio = Adaptersio;
