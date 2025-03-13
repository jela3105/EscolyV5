import { TokenRepository } from "../../domain/repositories/token.repository";

export class InMemoryTokenRepository implements TokenRepository {
  private invalidTokens = new Map<string, NodeJS.Timeout>();

  async invalidateToken(token: string, expireTime: number): Promise<void> {
    if (this.invalidTokens.has(token)) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const expiresInSeconds = expireTime - currentTime;

    if (expiresInSeconds > 0) {
      const timeout = setTimeout(() => {
        this.invalidTokens.delete(token);
      }, expiresInSeconds * 1000);

      this.invalidTokens.set(token, timeout);
    }
  }

  async isTokenInvalidated(token: string): Promise<boolean> {
    return this.invalidTokens.has(token);
  }

  async revalidateToken(token: string): Promise<boolean> {
    return this.invalidTokens.delete(token);
  }

}
