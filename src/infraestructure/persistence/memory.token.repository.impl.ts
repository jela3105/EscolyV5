import { TokenRepository } from "../../domain/repositories/token.repository";

export class InMemoryTokenRepository implements TokenRepository {
  private invalidTokens = new Map<string, NodeJS.Timeout>();

  async invalidateToken(token: string, expiresInSeconds: number): Promise<void> {
    if (this.invalidTokens.has(token)) return; 

    // Set timeout to automatically remove the token when it expires
    const timeout = setTimeout(() => {
      this.invalidTokens.delete(token);
    }, expiresInSeconds * 1000);return

    this.invalidTokens.set(token, timeout);
  }

  async isTokenInvalidated(token: string): Promise<boolean> {
    return this.invalidTokens.has(token);
  }

  async revalidateToken(token: string): Promise<boolean>{
    return this.invalidTokens.delete(token);
  }

}
