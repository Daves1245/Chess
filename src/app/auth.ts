export const lichessHost = 'https://lichess.org';
export const scopes = ['challenge:read', 'challenge:write', 'puzzle:read'];
export const clientId = 'example-app';
export const clientUrl = 'http://localhost:3000';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface UserData {
  id: string;
  username: string;
  [key: string]: unknown;
}

export class Auth {
  private static instance: Auth;
  private accessToken: string | null = null;
  private tokenType: string | null = null;
  private expiresAt: number | null = null;

  private constructor() {}

  public static init(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public async login(): Promise<void> {
    try {
      const codeVerifier = this.generateRandomString();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      const state = this.generateRandomString();

      localStorage.setItem('code_verifier', codeVerifier);
      localStorage.setItem('state', state);

      const authUrl = new URL(`${lichessHost}/oauth`);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('redirect_uri', clientUrl);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('scope', scopes.join(' '));

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async handleCallback(code: string, state: string): Promise<UserData> {
    const storedState = localStorage.getItem('state');
    const codeVerifier = localStorage.getItem('code_verifier');

    if (!storedState || !codeVerifier || storedState !== state) {
      throw new Error('Invalid state parameter');
    }

    try {
      const tokenResponse = await this.exchangeCodeForToken(code, codeVerifier);
      this.accessToken = tokenResponse.access_token;
      this.tokenType = tokenResponse.token_type;
      this.expiresAt = Date.now() + tokenResponse.expires_in * 1000;

      const userData = await this.fetchUserData();
      return userData;
    } catch (error) {
      console.error('Callback handling error:', error);
      throw error;
    }
  }

  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const tokenUrl = `${lichessHost}/api/token`;
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('code_verifier', codeVerifier);
    body.append('redirect_uri', clientUrl);
    body.append('client_id', clientId);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json() as TokenResponse;
  }

  private async fetchUserData(): Promise<UserData> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${lichessHost}/api/account`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return await response.json() as UserData;
  }

  public logout(): void {
    this.accessToken = null;
    this.tokenType = null;
    this.expiresAt = null;
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('state');
  }

  private generateRandomString(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

export const login = async (): Promise<void> => {
  const auth = Auth.init();
  await auth.login();
};

export const logout = (): void => {
  const auth = Auth.init();
  auth.logout();
};
