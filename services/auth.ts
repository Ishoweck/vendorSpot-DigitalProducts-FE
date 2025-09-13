import { authAPI } from "@/lib/api";
import { CookieService } from "@/lib/cookies";

export class AuthService {
  private static TOKEN_KEY = "auth_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";

  static getToken(): string | null {
    return CookieService.get(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return CookieService.get(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(token: string, refreshToken: string): void {
    CookieService.set(this.TOKEN_KEY, token, 1);
    CookieService.set(this.REFRESH_TOKEN_KEY, refreshToken, 7);
  }

  static clearTokens(): void {
    CookieService.remove(this.TOKEN_KEY);
    CookieService.remove(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await authAPI.refresh(refreshToken);
      if (response.data.success) {
        this.setTokens(
          response.data.data.token,
          response.data.data.refreshToken
        );
        return true;
      }
      return false;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  static logout(): void {
    this.clearTokens();
    window.location.href = "/login";
  }
}
