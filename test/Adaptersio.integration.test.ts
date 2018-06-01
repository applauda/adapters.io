import { Adaptersio, AdaptersioConfig } from "../lib/index";
import AWSDynamoDB from "../lib/service/database/AWSDynamoDB";

import { secrets } from "./secrets";
import AzureIotHub from "../lib/service/iothub/AzureIotHub";
import LoginWithAmazon from "../lib/service/auth/LoginWithAmazon";

test("test alexa integration", async () => {
  const config: AdaptersioConfig = {
    adapter: "alexa",
    auth: {
      getUser: jest.fn().mockReturnValue("user-aa")
    },
    iotHub: {
      sendCloud2DeviceMessage: jest.fn()
    },
    database: {
      updateDeviceState: jest.fn()
    },
    deviceTraits: ["on-off"]
  };
  const adaptersio = new Adaptersio(config);

  const event = {
    directive: {
      header: {
        namespace: "Alexa.PowerController",
        name: "TurnOn",
        payloadVersion: "3",
        messageId: "1bd5d003-31b9-476f-ad03-71d471922820",
        correlationToken: "dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg=="
      },
      endpoint: {
        scope: {
          type: "BearerToken",
          token: "access-token-from-skill"
        },
        endpointId: "appliance-001",
        cookie: {}
      },
      payload: {}
    }
  };

  let resultJson = null;
  const context = {
    succeed: (p: any) => {
      resultJson = p;
    }
  };

  await adaptersio.handleAwsRequest(event, context);
  expect(config.auth.getUser).toBeCalledWith("Bearer access-token-from-skill");
  expect(config.iotHub.sendCloud2DeviceMessage).toBeCalledWith(
    "appliance-001",
    "s1"
  );
  expect(config.database.updateDeviceState).toBeCalledWith(
    "user-aa",
    "appliance-001",
    "on",
    true
  );

  delete resultJson.context.properties[0].timeOfSample; // ignore timestamp

  expect(resultJson).toEqual({
    context: {
      properties: [
        {
          name: "powerState",
          namespace: "Alexa.PowerController",
          uncertaintyInMilliseconds: 50,
          value: "ON"
        }
      ]
    },
    endpoint: {
      cookie: {},
      endpointId: "appliance-001",
      scope: { token: "access-token-from-skill", type: "BearerToken" }
    },
    event: {
      header: {
        correlationToken: "dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==",
        messageId: "1bd5d003-31b9-476f-ad03-71d471922820-R",
        name: "Response",
        namespace: "Alexa",
        payloadVersion: "3"
      }
    },
    payload: {}
  });
});
