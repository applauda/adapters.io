import AlexaDispatcher from "./alexa/AlexaDispatcher";
import ActionsOnGoogleDispatcher from "./actions-on-google/ActionsOnGoogleDispatcher";
import AlexaAdapter from "./alexa/AlexaAdapter";
import SmartHomeServiceImpl from "./service/smarthome/SmartHomeService";
import ActionsOnGoogleAdapter from "./actions-on-google/ActionsOnGoogleAdapter";
import { AdaptersioConfig } from "./types";

export class Adaptersio {
  protected dispatcher?: AlexaDispatcher | ActionsOnGoogleDispatcher;

  constructor(protected config: AdaptersioConfig) {
    const smartHomeService = new SmartHomeServiceImpl(
      config.database,
      config.iotHub
    );

    switch (config.adapter) {
      case "alexa":
        this.dispatcher = new AlexaDispatcher(
          new AlexaAdapter(smartHomeService, config.auth, config.deviceTraits)
        );
        break;
      case "actions-on-google":
        this.dispatcher = new ActionsOnGoogleDispatcher(
          new ActionsOnGoogleAdapter(smartHomeService, config.auth, config.deviceTraits)
        );
        break;
    }
  }

  handleAwsRequest(event, context) {
    return this.dispatcher!!.dispatch(event, context);
  }
}
