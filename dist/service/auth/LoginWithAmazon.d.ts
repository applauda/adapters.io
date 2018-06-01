import { AuthService } from './types';
export default class LoginWithAmazon implements AuthService {
    getUser(authToken: string): Promise<string>;
}
