import createLogger from '../helper/logging';
import ActionsOnGoogleAdapter from './ActionsOnGoogleAdapter';

const logger = createLogger('ActionsOnGoogleDispatcher');

export default class ActionsOnGoogleDispatcher {
  constructor(protected adapter: ActionsOnGoogleAdapter) {}

  async dispatch(request: any, response: any) {
    // switch between manual mode and library mode
    // since smart home is not supported by library
    logger.info(`Request headers: ${JSON.stringify(request.headers)}`);
    logger.info(`Request body: ${JSON.stringify(request.body)}`);

    const smartHomeIntents = (request.body.inputs || []).filter((v: any) => v.intent && v.intent.startsWith('action.devices.'));

    if (smartHomeIntents.length > 0) {
      // manual mode
      logger.info('entering manual mode');

      const { intent } = smartHomeIntents[0];
      if (intent === 'action.devices.SYNC') {
        const json = await this.adapter.handleSync(request);
        logger.info('Request response', JSON.stringify(json));
        response.succeed(json);
      } else if (intent === 'action.devices.EXECUTE') {
        const json = await this.adapter.handleExecute(request);
        logger.info('Request response', JSON.stringify(json));
        response.succeed(json);
      } else if (intent === 'action.devices.QUERY') {
        const json = await this.adapter.handleQuery(request);
        logger.info('Request response', JSON.stringify(json));
        response.succeed(json);
      } else {
        logger.error('unknown intent', smartHomeIntents);
        response.fail({
          txt: 'Unknown intent',
          smartHomeIntents,
        });
      }
    } else {
      logger.error("unknown event", request);
    }
  }
}
