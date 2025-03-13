export interface TokenRepository {
  invalidateToken(token: string, expiresInSeconds: number): Promise<void>;
  isTokenInvalidated(token: string): Promise<boolean>;
  revalidateToken(token: string): Promise<boolean>;
}