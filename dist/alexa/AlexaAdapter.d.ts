import { AlexaLambdaEvent } from "./types";
import { SmartHomeService, DeviceTrait } from "../service/smarthome/types";
import { AuthService } from "../service/auth/types";
export default class AlexaAdapter {
    protected smartHomeService: SmartHomeService;
    protected authService: AuthService;
    protected deviceTraits: DeviceTrait[];
    constructor(smartHomeService: SmartHomeService, authService: AuthService, deviceTraits: DeviceTrait[]);
    getUser(event: AlexaLambdaEvent, attributeName: "payload" | "endpoint"): Promise<string>;
    handleDiscover(event: AlexaLambdaEvent): Promise<{
        event: {
            header: any;
            payload: {
                endpoints: {
                    endpointId: string;
                    manufacturerName: string;
                    friendlyName: string;
                    description: string;
                    displayCategories: string[];
                    cookie: {};
                    capabilities: ({
                        interface: string;
                        version: string;
                        type: string;
                        properties: {
                            supported: {
                                name: string;
                            }[];
                            retrievable: boolean;
                        };
                    } | {
                        type: string;
                        interface: string;
                        version: string;
                    })[];
                }[];
            };
        };
    }>;
    handlePower(event: AlexaLambdaEvent): Promise<{
        context: {
            properties: {
                namespace: string;
                name: string;
                value: string;
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            }[];
        };
        event: {
            header: any;
        };
        endpoint: {
            scope: {
                token: string;
            };
        } & {
            endpointId: string;
        };
        payload: {};
    }>;
    handleReportState(event: AlexaLambdaEvent): Promise<{
        context: {
            properties: ({
                namespace: string;
                name: string;
                value: string;
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            } | {
                namespace: string;
                name: string;
                value: number;
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            } | {
                namespace: string;
                name: string;
                value: {
                    hue: any;
                    saturation: any;
                    brightness: any;
                };
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            })[];
        };
        event: {
            header: any;
            endpoint: {
                scope: {
                    token: string;
                };
            } & {
                endpointId: string;
            };
            payload: {};
        };
    }>;
    handleSetBrightness(event: AlexaLambdaEvent): Promise<{
        context: {
            properties: {
                namespace: string;
                name: string;
                value: number;
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            }[];
        };
        event: {
            header: any;
            endpoint: {
                scope: {
                    token: string;
                };
            } & {
                endpointId: string;
            };
            payload: {};
        };
    }>;
    handleAdjustBrightness(event: AlexaLambdaEvent): Promise<{
        context: {
            properties: {
                namespace: string;
                name: string;
                value: number;
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            }[];
        };
        event: {
            header: any;
            endpoint: {
                scope: {
                    token: string;
                };
            } & {
                endpointId: string;
            };
            payload: {};
        };
    }>;
    handleSetColor(event: AlexaLambdaEvent): Promise<{
        context: {
            properties: {
                namespace: string;
                name: string;
                value: {
                    hue: number;
                    saturation: number;
                    brightness: number;
                };
                timeOfSample: string;
                uncertaintyInMilliseconds: number;
            }[];
        };
        event: {
            header: any;
            endpoint: {
                scope: {
                    token: string;
                };
            } & {
                endpointId: string;
            };
            payload: {};
        };
    }>;
    registerDevice(userId: string): Promise<{
        primaryKey: string;
        deviceId: string;
    }>;
}
