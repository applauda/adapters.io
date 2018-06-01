export declare type CommandDevice = {
    id: string;
};
export declare type DeviceState = {
    online?: boolean;
    brightness?: number;
    on?: boolean;
    color?: {
        name?: string;
        spectrumRGB: number;
    };
};
export declare type CommandExecution = {
    command: string;
    params: DeviceState;
};
export declare type Command = {
    devices: CommandDevice[];
    execution: CommandExecution[];
};
export declare type ActionsOnGoogleRequest = {
    headers: {
        /**
         * format: `Bearer xxxxyyyyyyzzzz`
         */
        Authorization: string;
    };
    body: {
        requestId: string;
        inputs: {
            payload: {
                commands: Command[];
                devices: CommandDevice[];
            };
        }[];
    };
};
export declare type ResponseCommand = {
    ids: string[];
    status: 'SUCCESS';
    states: DeviceState;
};
export declare type ActionsOnGoogleResponse = {
    requestId: string;
    payload: {
        commands: ResponseCommand[];
    };
};
