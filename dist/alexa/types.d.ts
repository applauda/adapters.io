export declare type EventDirectiveScope = {
    scope: {
        token: string;
    };
};
export declare type EventDirectivePayload = EventDirectiveScope & {
    brightness: AlexaBrightness;
    brightnessDelta: AlexaBrightness;
    color: AlexaColor;
};
export declare type EventDirectiveEndpoint = EventDirectiveScope & {
    endpointId: string;
};
export declare type EventDirective = {
    payload: EventDirectivePayload;
    endpoint: EventDirectiveEndpoint;
    header: any;
};
export declare type AlexaLambdaEvent = {
    directive: EventDirective;
};
/**
 * used as absolute value: 0-100
 * or relative: -100 to +100
 */
export declare type AlexaBrightness = number;
export declare type AlexaColor = {
    hue: number;
    saturation: number;
    brightness: number;
};
