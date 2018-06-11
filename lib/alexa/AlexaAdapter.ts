import { values } from "lodash";
import * as tinycolor from "tinycolor2";

import { AlexaLambdaEvent } from "./types";
import { SmartHomeService, DeviceTrait } from "../service/smarthome/types";
import { AuthService } from "../service/auth/types";

export default class AlexaAdapter {
  constructor(
    protected smartHomeService: SmartHomeService,
    protected authService: AuthService,
    protected deviceTraits: DeviceTrait[],
  ) {}

  getUser(event: AlexaLambdaEvent, attributeName: "payload" | "endpoint") {
    return this.authService.getUser(
      `Bearer ${event.directive[attributeName].scope.token}`
    );
  }

  async handleDiscover(event: AlexaLambdaEvent) {
    const userId = await this.getUser(event, "payload");
    const discovery = await this.smartHomeService.discoverDevices(userId);

    // depending on the supported device traits
    const capabilities = [{
      type: "AlexaInterface",
      interface: "Alexa",
      version: "3"
    }, ...this.deviceTraits.map(trait => {
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
      } else if (trait === "brightness") {
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
      } else if (trait === "color-spectrum") {
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
      } else {
        throw new Error(`Unsupported device trait: ${trait}`);
      }
    })];

    const payload = {
      endpoints: values(discovery).map(dev => ({
        endpointId: dev.deviceId,
        manufacturerName: "applauda GmbH",
        friendlyName: dev.name,
        description: dev.name,
        displayCategories: ["LIGHT"],
        cookie: {},
        capabilities
      }))
    };

    const { header } = event.directive;
    header.name = "Discover.Response";
    return { event: { header, payload } };
  }

  async handlePower(event: AlexaLambdaEvent) {
    if (!this.deviceTraits.includes("on-off")) {
      throw new Error("Device trait on-off is not activated.");
    }

    const userId = await this.getUser(event, "endpoint");

    const requestMethod = event.directive.header.name;
    const deviceId = event.directive.endpoint.endpointId;

    let powerResult;
    if (requestMethod === "TurnOn") {
      powerResult = true;
    } else {
      powerResult = false;
    }
    await this.smartHomeService.switchLight(userId, deviceId, powerResult);

    const contextResult = {
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
    const responseHeader = event.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "Response";
    responseHeader.messageId += "-R";
    const response = {
      context: contextResult,
      event: {
        header: responseHeader
      },
      endpoint: event.directive.endpoint,
      payload: {}
    };
    return response;
  }

  async handleReportState(event: AlexaLambdaEvent) {
    const userId = await this.getUser(event, "endpoint");

    const devices = [event.directive.endpoint.endpointId];
    const state = await this.smartHomeService.getDeviceState(userId, devices);
    const devState = state[event.directive.endpoint.endpointId];

    const { color } = devState;
    const colorWrapped = tinycolor(color);
    const colorHsv = colorWrapped.toHsv();

    const responseHeader = event.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "StateReport";
    responseHeader.messageId += "-R";

    // properties depending on supported device traits
    const properties = this.deviceTraits.map(trait => {
      if (trait === "on-off") {
        return {
          namespace: "Alexa.PowerController",
          name: "powerState",
          value: devState.on ? "ON" : "OFF",
          timeOfSample: new Date().toJSON(),
          uncertaintyInMilliseconds: 1000
        };
      } else if (trait === "brightness") {
        return {
          namespace: "Alexa.BrightnessController",
          name: "brightness",
          value: devState.brightness,
          timeOfSample: new Date().toJSON(),
          uncertaintyInMilliseconds: 1000
        };
      } else if (trait === "color-spectrum") {
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
      } else {
        throw new Error(`Unsupported device trait: ${trait}`);
      }
    });

    return {
      context: {
        properties
      },
      event: {
        header: responseHeader,
        endpoint: event.directive.endpoint,
        payload: {}
      }
    };
  }

  async handleSetBrightness(event: AlexaLambdaEvent) {
    if (!this.deviceTraits.includes("brightness")) {
      throw new Error("Device trait brightness is not activated.");
    }

    const userId = await this.getUser(event, "endpoint");

    const deviceId = event.directive.endpoint.endpointId;
    const { brightness } = event.directive.payload;
    await this.smartHomeService.setBrightness(userId, deviceId, brightness);

    const responseHeader = event.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "Response";
    responseHeader.messageId += "-R";

    return {
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
    };
  }

  async handleAdjustBrightness(event: AlexaLambdaEvent) {
    if (!this.deviceTraits.includes("brightness")) {
      throw new Error("Device trait brightness is not activated.");
    }

    const userId = await this.getUser(event, "endpoint");

    const deviceId = event.directive.endpoint.endpointId;
    const delta = event.directive.payload.brightnessDelta;

    const states = await this.smartHomeService.getDeviceState(userId, [
      deviceId
    ]);
    const currentBrightness = states[deviceId].brightness;
    const brightness = Math.max(0, Math.min(100, currentBrightness + delta));

    await this.smartHomeService.setBrightness(userId, deviceId, brightness);

    const responseHeader = event.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "Response";
    responseHeader.messageId += "-R";

    return {
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
    };
  }

  async handleSetColor(event: AlexaLambdaEvent) {
    if (!this.deviceTraits.includes("color-spectrum")) {
      throw new Error("Device trait color-spectrum is not activated.");
    }

    const userId = await this.getUser(event, "endpoint");

    const deviceId = event.directive.endpoint.endpointId;
    const { color } = event.directive.payload;

    const colorWrapped = tinycolor({
      h: color.hue,
      s: color.saturation,
      v: color.brightness
    });
    const colorRGB = colorWrapped.toHexString();

    await this.smartHomeService.setColor(userId, deviceId, colorRGB);

    const responseHeader = event.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "Response";
    responseHeader.messageId += "-R";

    return {
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
    };
  }

  registerDevice(userId: string) {
    return this.smartHomeService.registerDevice(userId, this.deviceTraits);
  }
}
