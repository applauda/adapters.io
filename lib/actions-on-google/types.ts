export type CommandDevice = {
  id: string,
};

export type DeviceState = {
  online?: boolean,
  brightness?: number,
  on?: boolean,
  color?: {
    name?: string,
    spectrumRGB: number,
  },
};

export type CommandExecution = {
  command: string,
  params: DeviceState,
};

export type Command = {
  devices: CommandDevice[],
  execution: CommandExecution[],
};

export type ActionsOnGoogleRequest = {
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
        commands: Command[],
        devices: CommandDevice[],
      };
    }[];
  };
};

export type ResponseCommand = {
  ids: string[],
  status: 'SUCCESS',
  states: DeviceState,
};

export type ActionsOnGoogleResponse = {
  requestId: string,
  payload: {
    commands: ResponseCommand[],
  }
};
