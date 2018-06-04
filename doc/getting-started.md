# Getting started with Adapters.IO

To get the whole running you have to take care of all these steps:

1. Create your fulfillment service for your Assistant/Skill (Alexa, Actions on Google, etc.)
2. Setup the Assistant/Smart Home Skill and connect to your fulfillment service
3. Setup a database and take care of the device registration
4. Connect your physical device with your iothub/device gateway and implement the supported commands

## Adapt Alexa

### Prerequirements

- Use Payload version 3 Smart Home Skill.
- Your lambda service must include the Alexa Smart Home source type.

### Create your fullfilment web service (e.g. as AWS lambda function)

Basic example:

```typescript
import {
  Adaptersio,
  Auth,
  Database,
  IotHub,
  AdaptersioConfig
} from "adaptersio";

exports.handler = function(event, context) {
  const config: AdaptersioConfig = {
    adapter: "alexa",
    auth: new Auth.LoginWithAmazon(),
    iotHub: new IotHub.AzureIotHub('connection-string'),
    database: new Database.AWSDynamoDB('dynamodb-table-name'),
    deviceTraits: ["on-off"]
  };
  const adaptersio = new Adaptersio(config);
  adaptersio.handleAwsRequest(event, context);
};
```

Take a look at the [device traits document](./device-traits.md) to check the supported features.

## Adapt Google Home / Actions on Google

### Create your fullfilment web service (e.g. as AWS lambda function)

Basic example:

```typescript
import {
  Adaptersio,
  Auth,
  Database,
  IotHub,
  AdaptersioConfig
} from "adaptersio";

exports.handler = function(event, context) {
  const config: AdaptersioConfig = {
    adapter: "actions-on-google",
    auth: new Auth.LoginWithAmazon(),
    iotHub: new IotHub.AzureIotHub('connection-string'),
    database: new Database.AWSDynamoDB('dynamodb-table-name'),
    deviceTraits: ["on-off"]
  };
  const adaptersio = new Adaptersio(config);
  adaptersio.handleAwsRequest(event, context);
};
```

Take a look at the [device traits document](./device-traits.md) to check the supported features.

### Use AWS lambda for Actions on Google

To access the AWS lambda from google, you have to configure a API gateway for it. Make sure that the request to the lambda has this structure:

```json
{
  "body": {},
  "headers": {}
}
```

You can archive this by using this Mapping Template:

```json
{
  "body" : $input.json('$'),
  "headers": {
    #foreach($param in $input.params().header.keySet())
    "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext),#end
    
    #end  
  }
}
```

## Setup database

Adapters.IO needs a database to store user/device information. You have this options:

#### a) Use the AWS DynamoDB implementation

Adapters.IO provides an create-to-use implementation for AWS DynamoDB (`Database.AWSDynamoDB`).
To use it, you have to:

- create a AWS DynamoDB database and table
- primary key: `userId`
- make sure to have API access via the aws-sdk

Pass the `Database.AWSDynamoDB` object to the configuration.

```typescript
    database: new Database.AWSDynamoDB('dynamodb-table-name'),
```

If you use AWS DynamoDB, make sure to have the peer dependency `aws-sdk`.

`npm install --save aws-sdk`


#### b) Use your own custom database implementation

You can use your own database and implement the database interface:

```typescript
class MyCustomDatabase implements Database {
  getDevicesForUser(userId: string): Promise<{[key: string]: SmartDevice}> {
    // ...
  }

  updateDeviceState(userId: string, deviceId: string, property: string, value: any): Promise<void> {
    // ...
  }

  createNewDevice(userId: string, uniqueId: string, primaryKey: string, deviceTraits: DeviceTrait[]): Promise<void>;
    // ...
  }
}
```

Pass your `MyCustomDatabase` object to the configuration.

```typescript
    database: new MyCustomDatabase(),
```

## Setup iot-hub / device gateway

Adapters.IO needs a way to contact the devices with the command as payload. There are this options:

#### a) Use the Azure Iot Hub

Adapters.IO provides an create-to-use implementation for Azure Iot Hub (`IotHub.AzureIotHub`).
To use it, you have to:

- create a Azure IoT Hub
- Get the connecting string with access to `registry write and device connect`. This can be found under `Shared access policies` user iothubowner.

Pass the `IotHub.AzureIotHub` object to the configuration.

```typescript
  iotHub: new IotHub.AzureIotHub('azure-iothub-connecting-string'),
```

If you use Azure IotHub, make sure to have the peer dependency `azure-iothub`.

`npm install --save azure-iothub`


#### b) Use any other gateway

You can implement your own gateway by implementing the iothub interface:

```typescript
class MyDeviceGateway implements IotHubService {
  sendCloud2DeviceMessage(deviceId: string, message: string): Promise<boolean> {
    // ...
  }

  createDeviceIdentity(uniqueId: string): Promise<string> {
    // ...
  }
}
```

Pass your `MyDeviceGateway` object to the configuration.

```typescript
    iotHub: new MyDeviceGateway(),
```

## Setup authorization

Adapters.IO works with OAuth 2.0. The OAuth 2.0 access token is passed to the authentification service and that will contact the auth server and returns the unique user id.

There are this options:

#### a) Use Login with Amazon as OAuth2 provider

Adapters.IO provides an create-to-use implementation for Login with Amazon (`Auth.LoginWithAmazon`). You can use this without any further configuration. Just make sure, that your lambda is called with a OAuth2.0 access token for your Login with Amazon provider.

Pass the `Auth.LoginWithAmazon` object to the configuration.

```typescript
    auth: new Auth.LoginWithAmazon(),
```

#### b) Use any other OAuth2.0 provider

You can implement your own handler for the OAuth2.0 authentification:

```typescript
class MyAuth implements AuthService {
  getUser(authToken: string): Promise<string> {
    // ...
  }
}
```

Pass your `MyAuth` object to the configuration.

```typescript
    auth: new MyAuth(),
```

## Register new users and devices

To register a new user or device to the system, you have to invoke the registerDevice command. If there is no user entry in the database, a user with the given userid is created. Then a new device id will be generated and added to the user.

This is done via this event:

```json
{
  "command": "registerDevice",
  "payload": {
    "user": "USER_ID"
  }
}
```

It will return this json structure:

```json
{
  "primaryKey": "xxxxx",
  "deviceId": "yyyyy"
}
```

## Implement device commands

Depending on the chosen device traits, you have to implement the commands on your end device. Each device trait has its own command.

Take a look at the [device traits document](./device-traits.md) to check the commands.
