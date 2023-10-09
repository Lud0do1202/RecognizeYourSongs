import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStorage } from 'src/app/interfaces/storage/auth-storage';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private http: HttpClient, private router: Router) {}

  /* *********************************************** */
  /** Get a code verifier */
  private generateRandomString(length: number): string {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /* *********************************************** */
  /** Get a code challenge */
  private async generateCodeChallenge(codeVerifier: string) {
    function base64encode(buffer: ArrayBuffer) {
      const binary = Array.from(new Uint8Array(buffer));
      return btoa(binary.map((byte) => String.fromCharCode(byte)).join(''))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
  }

  /* *********************************************** */
  /** Ask the authorization for conditions */
  auth(): void {
    // Already accept condition
    if (this.storage.getRefreshToken() !== null) {
      this.router.navigateByUrl('/home');
      return;
    }

    // Must get a code verifier
    let codeVerifier = this.generateRandomString(128);

    // Generate code challenge
    this.generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = this.generateRandomString(16);

      // Scopes
      let scopes = ['playlist-read-private', 'user-modify-playback-state', 'user-read-playback-state'];
      let scope = scopes.join(' ');

      // Set the code verifier
      this.storage.setCodeVerifier(codeVerifier);

      // Auth
      let args = new URLSearchParams({
        response_type: 'code',
        client_id: environment.appClientID,
        scope: scope,
        redirect_uri: environment.url.home,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      });

      window.location.href = 'https://accounts.spotify.com/authorize?' + args;
    });
  }

  /* *********************************************** */
  /** Get the token */
  getToken(code: string, codeVerifier: string): Observable<any> {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    let body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code!,
      redirect_uri: environment.url.home,
      client_id: environment.appClientID,
      code_verifier: codeVerifier!,
    });

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers });
  }

  /* *********************************************** */
  /** Refresh the token */
  refreshToken(): Observable<any> {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    let body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.storage.getRefreshToken()!,
      client_id: environment.appClientID,
    });

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers });
  }

  /* *********************************************** */
  /* LOCAL STORAGE */
  storage: AuthStorage = {
    setCodeVerifier(codeVerifier: string) {
      localStorage.setItem('code_verifier', codeVerifier);
    },

    getCodeVerifier() {
      return localStorage.getItem('code_verifier');
    },

    setRefreshToken(refreshToken: string) {
      localStorage.setItem('refresh_token', refreshToken);
    },

    getRefreshToken() {
      return localStorage.getItem('refresh_token');
    },

    setToken(token: string) {
      localStorage.setItem('token', token);
    },

    getToken() {
      return localStorage.getItem('token');
    },
  };
}
