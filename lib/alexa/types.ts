export type EventDirectiveScope = {
  scope: {
    token: string;
  };
};

export type EventDirectivePayload = EventDirectiveScope & {
  brightness: AlexaBrightness;
  brightnessDelta: AlexaBrightness;
  color: AlexaColor;
};

export type EventDirectiveEndpoint = EventDirectiveScope & {
  endpointId: string;
};

export type EventDirective = {
  payload: EventDirectivePayload;
  endpoint: EventDirectiveEndpoint;
  header: any;
};

export type AlexaLambdaEvent = {
  directive: EventDirective;
};

/**
 * used as absolute value: 0-100
 * or relative: -100 to +100
 */
export type AlexaBrightness = number;

export type AlexaColor = {
  hue: number,
  saturation: number,
  brightness: number,
};
