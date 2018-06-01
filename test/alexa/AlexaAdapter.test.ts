import AlexaAdapter from '../../lib/alexa/AlexaAdapter';
import { SmartHomeService, LightBrightness, RGBHexString } from '../../lib/service/smartHome/types';
import { DeviceTrait } from '../../lib';

const deviceTraits: DeviceTrait[] = ["on-off", "brightness", "color-spectrum"];

test('handle discovery', async () => {
  const smartHomeService: SmartHomeService = {
    discoverDevices: async (user: string) => ({
      a: {
        deviceId: 'a',
        name: `b${user}`,
      },
    }),
    switchLight: jest.fn(),
    setBrightness: jest.fn(),
    setColor: jest.fn(),
    getDeviceState: jest.fn(),
    registerDevice: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const event = {
    directive: {
      header: {
        namespace: 'Alexa.Discovery',
        name: 'Discover',
      },
      payload: {
        scope: {
          token: 'accessToken',
        },
      },
    },
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);
  const result = await adapter.handleDiscover(event);

  expect(userService.getUser).toBeCalledWith('Bearer accessToken');
  expect(result).toEqual({
    event: {
      header: { name: 'Discover.Response', namespace: 'Alexa.Discovery' },
      payload: {
        endpoints: [
          {
            capabilities: [
              { interface: 'Alexa', type: 'AlexaInterface', version: '3' },
              {
                interface: 'Alexa.PowerController',
                properties: {
                  retrievable: true,
                  supported: [{ name: 'powerState' }],
                },
                type: 'AlexaInterface',
                version: '3',
              },
              {
                interface: 'Alexa.BrightnessController',
                properties: {
                  retrievable: true,
                  supported: [{ name: 'brightness' }],
                },
                type: 'AlexaInterface',
                version: '3',
              },
              {
                interface: 'Alexa.ColorController',
                properties: {
                  retrievable: true,
                  supported: [{ name: 'color' }],
                },
                type: 'AlexaInterface',
                version: '3',
              },
            ],
            cookie: {},
            description: 'buser',
            displayCategories: ['LIGHT'],
            endpointId: 'a',
            friendlyName: 'buser',
            manufacturerName: 'applauda GmbH',
          },
        ],
      },
    },
  });
});

test('handle turn lights on', async () => {
  const smartHomeService = {
    discoverDevices: jest.fn(),
    setBrightness: jest.fn(),
    setColor: jest.fn(),
    getDeviceState: jest.fn(),
    registerDevice: jest.fn(),
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);

  const request = {
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOn',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
        cookie: {},
      },
      payload: {},
    },
  };

  const result = await adapter.handlePower(request);
  expect(smartHomeService.switchLight).toBeCalledWith('user', 'appliance-001', true);
  // ignore time in this test
  result.context.properties[0].timeOfSample = 'x';
  expect(result).toEqual({
    context: {
      properties: [
        {
          name: 'powerState',
          namespace: 'Alexa.PowerController',
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 50,
          value: 'ON',
        },
      ],
    },
    endpoint: {
      cookie: {},
      endpointId: 'appliance-001',
      scope: { token: 'access-token-from-skill', type: 'BearerToken' },
    },
    event: {
      header: {
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820-R',
        name: 'Response',
        namespace: 'Alexa',
        payloadVersion: '3',
      },
    },
    payload: {},
  });
});

test('handle query state', async () => {
  const smartHomeService = {
    getDeviceState: jest.fn().mockReturnValueOnce({
      'appliance-001': {
        on: true,
        brightness: 90,
        color: '#ffff00',
      },
    }),
    discoverDevices: jest.fn(),
    setBrightness: jest.fn(),
    setColor: jest.fn(),
    registerDevice: jest.fn(),
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);

  const request = {
    directive: {
      header: {
        messageId: 'abc-123-def-456',
        correlationToken: 'abcdef-123456',
        namespace: 'Alexa',
        name: 'ReportState',
        payloadVersion: '3',
      },
      endpoint: {
        endpointId: 'appliance-001',
        cookie: {},
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
      },
      payload: {},
    },
  };

  const result = await adapter.handleReportState(request);
  expect(smartHomeService.getDeviceState).toBeCalledWith('user', [
    'appliance-001',
  ]);
  // ignore time in this test
  result.context.properties[0].timeOfSample = 'x';
  result.context.properties[1].timeOfSample = 'x';
  result.context.properties[2].timeOfSample = 'x';
  expect(result).toEqual({
    context: {
      properties: [{
          "name": "powerState",
          "namespace": "Alexa.PowerController",
          "timeOfSample": "x",
          "uncertaintyInMilliseconds": 1000,
          "value": "ON",
        },
        {
          namespace: 'Alexa.BrightnessController',
          name: 'brightness',
          value: 90,
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 1000,
        },
        {
          namespace: 'Alexa.ColorController',
          name: 'color',
          value: {
            hue: 60,
            saturation: 1.0,
            brightness: 1,
          },
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 1000,
        },
      ],
    },
    event: {
      header: {
        messageId: 'abc-123-def-456-R',
        correlationToken: 'abcdef-123456',
        namespace: 'Alexa',
        name: 'StateReport',
        payloadVersion: '3',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
        cookie: {},
      },
      payload: {},
    },
  });
});

test('handle set brightness', async () => {
  const smartHomeService = {
    discoverDevices: jest.fn(),
    setBrightness: jest.fn(),
    setColor: jest.fn(),
    getDeviceState: jest.fn(),
    registerDevice: jest.fn(),
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);

  const request = {
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'SetBrightness',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {
        brightness: 42,
      },
    },
  };

  const result = await adapter.handleSetBrightness(request);
  expect(smartHomeService.setBrightness).toBeCalledWith('user', 'appliance-001', 42);
  // ignore time in this test
  result.context.properties[0].timeOfSample = 'x';
  expect(result).toEqual({
    context: {
      properties: [
        {
          namespace: 'Alexa.BrightnessController',
          name: 'brightness',
          value: 42,
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 1000,
        },
      ],
    },
    event: {
      header: {
        namespace: 'Alexa',
        name: 'Response',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820-R',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {},
    },
  });
});

test('handle adjust brightness', async () => {
  const smartHomeService = {
    setBrightness: jest.fn(),
    getDeviceState: jest.fn().mockReturnValueOnce({
      'appliance-001': {
        on: true,
        brightness: 90,
      },
    }),
    discoverDevices: jest.fn(),
    setColor: jest.fn(),
    registerDevice: jest.fn(),
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);

  const request = {
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'AdjustBrightness',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {
        brightnessDelta: 5,
      },
    },
  };

  const result = await adapter.handleAdjustBrightness(request);
  expect(smartHomeService.setBrightness).toBeCalledWith('user', 'appliance-001', 95);
  // ignore time in this test
  result.context.properties[0].timeOfSample = 'x';
  expect(result).toEqual({
    context: {
      properties: [
        {
          namespace: 'Alexa.BrightnessController',
          name: 'brightness',
          value: 95,
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 1000,
        },
      ],
    },
    event: {
      header: {
        namespace: 'Alexa',
        name: 'Response',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820-R',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {},
    },
  });
});

test('handle set color', async () => {
  const smartHomeService = {
    discoverDevices: jest.fn(),
    setBrightness: jest.fn(),
    setColor: jest.fn(),
    getDeviceState: jest.fn(),
    registerDevice: jest.fn(),
    switchLight: jest.fn(),
  };
  const userService = {
    getUser: jest.fn().mockReturnValueOnce('user'),
  };

  const adapter = new AlexaAdapter(smartHomeService, userService, deviceTraits);

  const request = {
    directive: {
      header: {
        namespace: 'Alexa.ColorController',
        name: 'SetColor',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {
        color: {
          hue: 60,
          saturation: 1,
          brightness: 1,
        },
      },
    },
  };

  const result = await adapter.handleSetColor(request);
  expect(smartHomeService.setColor).toBeCalledWith('user', 'appliance-001', '#ffff00');
  // ignore time in this test
  result.context.properties[0].timeOfSample = 'x';
  expect(result).toEqual({
    context: {
      properties: [
        {
          namespace: 'Alexa.ColorController',
          name: 'color',
          value: {
            hue: 60,
            saturation: 1,
            brightness: 1,
          },
          timeOfSample: 'x',
          uncertaintyInMilliseconds: 1000,
        },
      ],
    },
    event: {
      header: {
        namespace: 'Alexa',
        name: 'Response',
        payloadVersion: '3',
        messageId: '1bd5d003-31b9-476f-ad03-71d471922820-R',
        correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: 'access-token-from-skill',
        },
        endpointId: 'appliance-001',
      },
      payload: {},
    },
  });
});
