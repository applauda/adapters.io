import AlexaAdapter from './AlexaAdapter';

import createLogger from '../helper/logging';
const logger = createLogger('AlexaDispatcher');

export default class AlexaDispatcher {
  constructor(protected adapter: AlexaAdapter) {
  }

  async dispatch(event: any, context: any) {
    logger.info('Request event: ', JSON.stringify(event), JSON.stringify(context));

    if (event && event.command === 'registerDevice') {
      const answer = await this.adapter.registerDevice(event.payload.user);
      context.succeed(answer);
    } else if (
      event.directive.header.namespace === 'Alexa.Discovery' &&
      event.directive.header.name === 'Discover'
    ) {
      logger.info('Discover request', JSON.stringify(event));
      const answer = await this.adapter.handleDiscover(event);
      logger.info('Request response', JSON.stringify(answer));
      context.succeed(answer);
    } else if (event.directive.header.namespace === 'Alexa.PowerController') {
      if (
        event.directive.header.name === 'TurnOn' ||
        event.directive.header.name === 'TurnOff'
      ) {
        logger.info('TurnOn or TurnOff Request', JSON.stringify(event));
        const answer = await this.adapter.handlePower(event);
        logger.info('Request response', JSON.stringify(answer));
        context.succeed(answer);
      }
    } else if (
      event.directive.header.namespace === 'Alexa.BrightnessController'
    ) {
      if (event.directive.header.name === 'SetBrightness') {
        logger.info('SetBrightness Request', JSON.stringify(event));
        const answer = await this.adapter.handleSetBrightness(event);
        logger.info('Request response', JSON.stringify(answer));
        context.succeed(answer);
      } else if (event.directive.header.name === 'AdjustBrightness') {
        logger.info('AdjustBrightness Request', JSON.stringify(event));
        const answer = await this.adapter.handleAdjustBrightness(event);
        logger.info('Request response', JSON.stringify(answer));
        context.succeed(answer);
      }
    } else if (
      event.directive.header.namespace === 'Alexa.ColorController'
    ) {
      if (event.directive.header.name === 'SetColor') {
        logger.info('SetColor Request', JSON.stringify(event));
        const answer = await this.adapter.handleSetColor(event);
        logger.info('Request response', JSON.stringify(answer));
        context.succeed(answer);
      }
    } else if (
      event.directive.header.namespace === 'Alexa' &&
      event.directive.header.name === 'ReportState'
    ) {
      logger.info('Report State Request', JSON.stringify(event));
      const answer = await this.adapter.handleReportState(event);
      logger.info('Request response', JSON.stringify(answer));
      context.succeed(answer);
    } else {
      logger.error("unknown event", event);
    }
  }
}
