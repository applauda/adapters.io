import AlexaDispatcher from "./alexa/AlexaDispatcher";
import ActionsOnGoogleDispatcher from "./actions-on-google/ActionsOnGoogleDispatcher";
import { AdaptersioConfig } from "./types";
export declare class Adaptersio {
    protected config: AdaptersioConfig;
    protected dispatcher?: AlexaDispatcher | ActionsOnGoogleDispatcher;
    constructor(config: AdaptersioConfig);
    handleAwsRequest(event: any, context: any): Promise<void>;
}
