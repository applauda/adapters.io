# Adapters.IO [![Build Status](https://travis-ci.org/applauda/adapters.io.svg?branch=master)](https://travis-ci.org/applauda/adapters.io)

## What is Adapters.IO

Adapters.IO is a framework to handle smart home systems with a single codebase. The goal is to have adapters for different systems. Currently there is support for Alexa and Actions on Google (Google Home).
The framework is flexible, to support different authentication providers, different databases and idfferent Iothub's.
Currently there are built-in classes for LoginWithAmazon, Azure IotHub and AWS DynamoDB, but it is very easy to implement your own interfaces to support any other database, auth or iothub.

### Main features

- Support for Alexa Smart Home
- Support for Actions on Google Smarthome agent
- Support for hosting at AWS lambda
- Built-in class to use Azure IotHub
- Built-in class to use AWS DynamoDB
- Built-in class to use Login With Amazon
- Interfaces to implement your own services
- Configurable [device traits](./doc/device-traits.md)

### Main focus

- Simplicity: Just choose your smart home system, database, auth and iothub solution and it will work out of the box.

- Flexibility: If you want to use your own service (auth, database, etc.) just implement the interface.

## Usage example

`npm install --save adaptersio`

This is a basic example, for Alexa integration, using AWS DynamoDB and Azure IotHub, and hosting as AWS lambda function.

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

## [Getting started with Adapters.IO](./doc/getting-started.md)
