export interface AuthService {
    /**
     * @param authToken OAuth Token
     * @returns userId
     */
    getUser(authToken: string): Promise<string>;
}
