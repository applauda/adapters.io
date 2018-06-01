import ActionsOnGoogleDispatcher from '../../lib/actions-on-google/ActionsOnGoogleDispatcher';

test('dispatch sync', async () => {
  const adapterMock = {
    handleSync: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new ActionsOnGoogleDispatcher(adapterMock);
  const request = {
    headers: { authorization: 'accessToken' },
    body: {
      requestId: '99',
      inputs: [
        {
          intent: 'action.devices.SYNC',
        },
      ],
    },
  };
  const response = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, response);

  expect(adapterMock.handleSync).toBeCalledWith(request);
  expect(response.succeed).toBeCalledWith('answer');
});

test('dispatch execute', async () => {
  const adapterMock = {
    handleExecute: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new ActionsOnGoogleDispatcher(adapterMock);
  const request = {
    headers: { authorization: 'accessToken' },
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
  const response = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, response);

  expect(adapterMock.handleExecute).toBeCalledWith(request);
  expect(response.succeed).toBeCalledWith('answer');
});

test('dispatch query', async () => {
  const adapterMock = {
    handleQuery: jest.fn().mockReturnValueOnce('answer'),
  };
  const dispatcher = new ActionsOnGoogleDispatcher(adapterMock);
  const request = {
    headers: { authorization: 'accessToken' },
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
  const response = {
    succeed: jest.fn(),
  };
  await dispatcher.dispatch(request, response);

  expect(adapterMock.handleQuery).toBeCalledWith(request);
  expect(response.succeed).toBeCalledWith('answer');
});
