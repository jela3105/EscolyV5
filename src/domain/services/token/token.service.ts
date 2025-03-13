import { TokenRepository } from "../../../domain/repositories/token.repository";

export class TokenService {

    constructor(private tokenRepository: TokenRepository) { }

    async invalidateToken(token: string, expireTime: number): Promise<void> {
        this.tokenRepository.invalidateToken(token, expireTime);
    }

    async isTokenInvalidated(token: string): Promise<boolean> {
        return this.tokenRepository.isTokenInvalidated(token);
    }

    async revalidateToken(token: string) {
        this.tokenRepository.isTokenInvalidated(token);
    }

}