export interface AuthStorage {
  setCodeVerifier(codeVerifier: string): void;
  getCodeVerifier(): string | null;
  setRefreshToken(refreshToken: string): void;
  getRefreshToken(): string | null;
  setToken(token: string): void;
  getToken(): string | null;
}
