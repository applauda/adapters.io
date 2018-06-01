import { SmartHomeService, DeviceTrait } from "../service/smarthome/types";
import { AuthService } from "../service/auth/types";
import { ActionsOnGoogleRequest, ActionsOnGoogleResponse, DeviceState } from "./types";
export default class ActionsOnGoogleAdapter {
    protected smartHomeService: SmartHomeService;
    protected authService: AuthService;
    protected deviceTraits: DeviceTrait[];
    constructor(smartHomeService: SmartHomeService, authService: AuthService, deviceTraits: DeviceTrait[]);
    getUser(request: ActionsOnGoogleRequest): Promise<string>;
    handleSync(request: ActionsOnGoogleRequest): Promise<{
        requestId: string;
        payload: {
            agentUserId: string;
            devices: {
                id: string;
                type: string;
                traits: ("action.devices.traits.OnOff" | "action.devices.traits.Brightness" | "action.devices.traits.ColorSpectrum")[];
                name: {
                    name: string;
                };
                willReportState: boolean;
                attributes: {};
                deviceInfo: {
                    manufacturer: string;
                    model: string;
                    hwVersion: string;
                    swVersion: string;
                };
            }[];
        };
    }>;
    handleExecute(request: ActionsOnGoogleRequest): Promise<ActionsOnGoogleResponse>;
    handleQuery(request: ActionsOnGoogleRequest): Promise<{
        requestId: string;
        payload: {
            devices: {
                [key: string]: DeviceState;
            };
        };
    }>;
}
