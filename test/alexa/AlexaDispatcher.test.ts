import AlexaDispatcher from '../../lib/alexa/AlexaDispatcher';

test('dispatch discover', async () => {
  const adapterMock = {
    handleDiscover: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(event, context);

  expect(adapterMock.handleDiscover).toBeCalledWith(event);
  expect(context.succeed).toBeCalledWith('answer');
});

test('dispatch power', async () => {
  const adapterMock = {
    handlePower: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.handlePower).toBeCalledWith(request);
  expect(context.succeed).toBeCalledWith('answer');
});

test('dispatch report state', async () => {
  const adapterMock = {
    handleReportState: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.handleReportState).toBeCalledWith(request);
  expect(context.succeed).toBeCalledWith('answer');
});

test('dispatch set brightness', async () => {
  const adapterMock = {
    handleSetBrightness: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.handleSetBrightness).toBeCalledWith(request);
  expect(context.succeed).toBeCalledWith('answer');
});

test('dispatch adjust brightness', async () => {
  const adapterMock = {
    handleAdjustBrightness: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
        brightnessDelta: 3,
      },
    },
  };
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.handleAdjustBrightness).toBeCalledWith(request);
  expect(context.succeed).toBeCalledWith('answer');
});

test('dispatch set color', async () => {
  const adapterMock = {
    handleSetColor: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);
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
        cookie: {},
      },
      payload: {
        color: {
          hue: 350.5,
          saturation: 0.7138,
          brightness: 0.6524,
        },
      },
    },
  };
  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.handleSetColor).toBeCalledWith(request);
  expect(context.succeed).toBeCalledWith('answer');
});

test('register device', async () => {
  const request = {
    command: 'registerDevice',
    payload: {
      user: 'user',
    }
  };
  const adapterMock = {
    registerDevice: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new AlexaDispatcher(adapterMock);

  const context = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, context);

  expect(adapterMock.registerDevice).toBeCalledWith('user');
  expect(context.succeed).toBeCalledWith('answer');
});
