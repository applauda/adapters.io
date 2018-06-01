import axios from 'axios';

import { AuthService } from './types';

import createLogger from '../../helper/logging';
const logger = createLogger('LoginWithAmazon');

export default class LoginWithAmazon implements AuthService {
  async getUser(authToken: string) {
    const response = await axios({
      method: 'GET',
      url: 'https://api.amazon.com/user/profile',
      headers: {
        Authorization: authToken,
      },
    });
    if (response.status !== 200) {
      throw new Error(`Could not query profile from auth token: ${authToken}`);
    }

    logger.info(`User ID: ${response.data.user_id}`);
    return <string> response.data.user_id;
  }
}
