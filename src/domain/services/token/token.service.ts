import { TokenRepository } from "../../../domain/repositories/token.repository";

export class TokenService {

    constructor(private tokenRepository: TokenRepository) { }

    async invalidateToken(token: string, secondsToExpire: number): Promise<void> {
        this.tokenRepository.invalidateToken(token, secondsToExpire);
    }

    async isTokenInvalidated(token: string) {
        this.tokenRepository.isTokenInvalidated(token);
    }

    async revalidateToken(token: string) {
        this.tokenRepository.isTokenInvalidated(token);
    }

}