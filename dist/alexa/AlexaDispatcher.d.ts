import AlexaAdapter from './AlexaAdapter';
export default class AlexaDispatcher {
    protected adapter: AlexaAdapter;
    constructor(adapter: AlexaAdapter);
    dispatch(event: any, context: any): Promise<void>;
}
