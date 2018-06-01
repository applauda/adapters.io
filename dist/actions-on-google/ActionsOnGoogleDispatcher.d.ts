import ActionsOnGoogleAdapter from './ActionsOnGoogleAdapter';
export default class ActionsOnGoogleDispatcher {
    protected adapter: ActionsOnGoogleAdapter;
    constructor(adapter: ActionsOnGoogleAdapter);
    dispatch(request: any, response: any): Promise<void>;
}
