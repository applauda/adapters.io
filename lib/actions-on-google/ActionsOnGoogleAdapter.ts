import { mapValues, values } from "lodash";
import * as tinycolor from "tinycolor2";

import { colors } from "../helper/utils";
import { SmartHomeService, DeviceTrait } from "../service/smarthome/types";
import { AuthService } from "../service/auth/types";
import { ActionsOnGoogleRequest, ActionsOnGoogleResponse, DeviceState } from "./types";

export default class ActionsOnGoogleAdapter {
  constructor(
    protected smartHomeService: SmartHomeService,
    protected authService: AuthService,
    protected deviceTraits: DeviceTrait[],
  ) {}

  getUser(request: ActionsOnGoogleRequest) {
    return this.authService.getUser(request.headers.Authorization);
  }

  async handleSync(request: ActionsOnGoogleRequest) {
    const userId = await this.getUser(request);
    const discovery = await this.smartHomeService.discoverDevices(userId);

    const traits = this.deviceTraits.map(trait => {
      if (trait === "on-off") {
        return "action.devices.traits.OnOff";
      } else if (trait === "brightness") {
        return "action.devices.traits.Brightness";
      } else if (trait === "color-spectrum") {
        return "action.devices.traits.ColorSpectrum";
      } else {
        throw new Error(`Unknown device trait: ${trait}`);
      }
    });

    return {
      requestId: request.body.requestId,
      payload: {
        agentUserId: userId,
        devices: values(discovery).map(dev => ({
          id: dev.deviceId,
          type: "action.devices.types.LIGHT", // TODO make this configurable
          traits,
          name: {
            name: dev.name
          },
          willReportState: false,
          attributes: {},
          deviceInfo: {
            manufacturer: "applauda GmbH", // TODO make this configurable
            model: "sm1",
            hwVersion: "1.0",
            swVersion: "1.0"
          }
        }))
      }
    };
  }

  async handleExecute(request: ActionsOnGoogleRequest) {
    const user = await this.getUser(request);

    // multiple commands and devices
    // response is grouped by success/error status
    const { payload } = request.body.inputs[0];
    const response: ActionsOnGoogleResponse = {
      requestId: request.body.requestId,
      payload: {
        commands: []
      }
    };

    const commandPromises = [];

    payload.commands.forEach(({ devices, execution }) => {
      devices.forEach(device => {
        execution.forEach(command => {
          if (command.command === "action.devices.commands.OnOff") {
            if (!this.deviceTraits.includes("on-off")) {
              throw new Error("Device trait on-off is not activated.");
            }
        
            commandPromises.push(
              this.smartHomeService.switchLight(
                user,
                device.id,
                command.params.on!!
              )
            );
            response.payload.commands.push({
              ids: [device.id],
              status: "SUCCESS",
              states: {
                online: true,
                on: command.params.on
              }
            });

          } else if (
            command.command === "action.devices.commands.BrightnessAbsolute"
          ) {
            if (!this.deviceTraits.includes("brightness")) {
              throw new Error("Device trait brightness is not activated.");
            }
        
            commandPromises.push(
              this.smartHomeService.setBrightness(
                user,
                device.id,
                command.params.brightness!!
              )
            );
            response.payload.commands.push({
              ids: [device.id],
              status: "SUCCESS",
              states: {
                online: true,
                brightness: command.params.brightness
              }
            });

          } else if (
            command.command === "action.devices.commands.ColorAbsolute"
          ) {
            if (!this.deviceTraits.includes("color-spectrum")) {
              throw new Error("Device trait color-spectrum is not activated.");
            }
        
            const colorStr = colors.intToHexString(
              command.params.color!!.spectrumRGB
            );

            commandPromises.push(
              this.smartHomeService.setColor(user, device.id, colorStr)
            );

            response.payload.commands.push({
              ids: [device.id],
              status: "SUCCESS",
              states: {
                online: true,
                color: {
                  spectrumRGB: command.params.color!!.spectrumRGB
                }
              }
            });

          }
        });
      });
    });

    await Promise.all(commandPromises);
    
    return response;
  }

  async handleQuery(request: ActionsOnGoogleRequest) {
    const user = await this.getUser(request);
    const devices = request.body.inputs[0].payload.devices.map(d => d.id);
    const states = await this.smartHomeService.getDeviceState(user, devices);

    return {
      requestId: request.body.requestId,
      payload: {
        devices: <{[key: string]: DeviceState}> mapValues(states, dev => {
          const { color } = dev;
          const colorWrapped = tinycolor(color);
          const spectrumRGB = 999; // TODO

          const initial: DeviceState = {
            online: true,
          };

          const state = this.deviceTraits.reduce((prev, curr) => {
            if (curr === "on-off") {
              prev.on = dev.on;
            } else if (curr === "brightness") {
              prev.brightness = dev.brightness;
            } else if (curr === "color-spectrum") {
              prev.color = {
                name: colorWrapped.toName() || "unknown",
                spectrumRGB,
              };
            } else {
              throw new Error(`Unknown device trait: ${curr}`);
            }
            return prev;
          }, initial);

          return state;
        })
      }
    };
  }

  // TODO register device??
  
}
