import ActionsOnGoogleAdapter from '../../lib/actions-on-google/ActionsOnGoogleAdapter';

test('handle sync', async () => {
  // mock repository
  const smartHomeService = {
    discoverDevices: async user => ({
      a: {
        deviceId: 'a',
        name: `b${user}`,
      },
    }),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const request = {
    headers: { Authorization: 'accessToken' },
    body: {
      requestId: '99',
      inputs: [
        {
          intent: 'action.devices.SYNC',
        },
      ],
    },
  };

  const adapter = new ActionsOnGoogleAdapter(smartHomeService, userService, ["on-off"]);
  const result = await adapter.handleSync(request);

  expect(userService.getUser).toBeCalledWith('accessToken');

  expect(result.requestId).toBe('99');
  expect(result.payload.agentUserId).toBe('user');
  expect(result.payload.devices.length).toBe(1);
  expect(result.payload.devices[0].id).toBe('a');
  expect(result.payload.devices[0].name.name).toBe('buser');
});

test('handle turn lights on', async () => {
  const smartHomeService = {
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new ActionsOnGoogleAdapter(smartHomeService, userService, ["on-off"]);

  const request = {
    headers: { Authorization: 'accessToken' },
    body: {
      requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
      inputs: [
        {
          intent: 'action.devices.EXECUTE',
          payload: {
            commands: [
              {
                devices: [
                  {
                    id: '123',
                  },
                  {
                    id: '456',
                  },
                ],
                execution: [
                  {
                    command: 'action.devices.commands.OnOff',
                    params: {
                      on: true,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };
  const result = await adapter.handleExecute(request);
  expect(smartHomeService.switchLight).toHaveBeenCalledTimes(2);
  expect(smartHomeService.switchLight).toBeCalledWith('user', '123', true);
  expect(smartHomeService.switchLight).toBeCalledWith('user', '456', true);
  expect(result).toEqual({
    payload: {
      commands: [
        { ids: ['123'], states: { on: true, online: true }, status: 'SUCCESS' },
        { ids: ['456'], states: { on: true, online: true }, status: 'SUCCESS' },
      ],
    },
    requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
  });
});

test('handle set brightness', async () => {
  const smartHomeService = {
    setBrightness: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new ActionsOnGoogleAdapter(smartHomeService, userService, ["brightness"]);

  const request = {
    headers: { Authorization: 'accessToken' },
    body: {
      requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
      inputs: [
        {
          intent: 'action.devices.EXECUTE',
          payload: {
            commands: [
              {
                devices: [
                  {
                    id: '123',
                  },
                ],
                execution: [
                  {
                    command: 'action.devices.commands.BrightnessAbsolute',
                    params: {
                      brightness: 65,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };
  const result = await adapter.handleExecute(request);
  expect(smartHomeService.setBrightness).toHaveBeenCalledTimes(1);
  expect(smartHomeService.setBrightness).toBeCalledWith('user', '123', 65);
  expect(result).toEqual({
    requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
    payload: {
      commands: [
        {
          ids: ['123'],
          status: 'SUCCESS',
          states: {
            brightness: 65,
            online: true,
          },
        },
      ],
    },
  });
});

test('handle set color', async () => {
  const smartHomeService = {
    setColor: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new ActionsOnGoogleAdapter(smartHomeService, userService, ["color-spectrum"]);

  const request = {
    headers: { Authorization: 'accessToken' },
    body: {
      requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
      inputs: [
        {
          intent: 'action.devices.EXECUTE',
          payload: {
            commands: [
              {
                devices: [
                  {
                    id: '123',
                  },
                ],
                execution: [
                  {
                    command: 'action.devices.commands.ColorAbsolute',
                    params: {
                      color: { name: 'red', spectrumRGB: 16711680 },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };
  const result = await adapter.handleExecute(request);
  expect(smartHomeService.setColor).toHaveBeenCalledTimes(1);
  expect(smartHomeService.setColor).toBeCalledWith('user', '123', '#ff0000');
  expect(result).toEqual({
    requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
    payload: {
      commands: [
        {
          ids: ['123'],
          status: 'SUCCESS',
          states: {
            color: {
              spectrumRGB: 16711680,
            },
            online: true,
          },
        },
      ],
    },
  });
});

test('handle query', async () => {
  const smartHomeService = {
    getDeviceState: jest.fn().mockReturnValueOnce({
      123: {
        on: true,
        brightness: 9,
        color: '#ff0000',
      },
    }),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new ActionsOnGoogleAdapter(smartHomeService, userService, ["on-off", "brightness", "color-spectrum"]);

  const request = {
    headers: { Authorization: 'accessToken' },
    body: {
      requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
      inputs: [
        {
          intent: 'action.devices.QUERY',
          payload: {
            devices: [
              {
                id: '123',
              },
            ],
          },
        },
      ],
    },
  };
  const result = await adapter.handleQuery(request);
  expect(smartHomeService.getDeviceState).toBeCalledWith('user', ['123']);
  expect(result).toEqual({
    payload: {
      devices: {
        123: {
          brightness: 9,
          color: { name: 'red', spectrumRGB: 999 },
          on: true,
          online: true,
        },
      },
    },
    requestId: 'ff36a3cc-ec34-11e6-b1a0-64510650abcf',
  });
});
