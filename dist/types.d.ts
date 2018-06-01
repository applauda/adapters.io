import { AuthService } from "./service/auth/types";
import { IotHubService } from "./service/iothub/types";
import { Database } from "./service/database/types";
import { DeviceTrait } from "./service/smarthome/types";
export interface AdaptersioConfig {
    adapter: "alexa" | "actions-on-google";
    auth: AuthService;
    iotHub: IotHubService;
    database: Database;
    deviceTraits: DeviceTrait[];
}
