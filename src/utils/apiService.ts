import { TokenService } from './tokenService';

const baseUrl = import.meta.env.VITE_API_URL;

export class ApiService {
  static async getServers(): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...TokenService.getAuthHeader(),
    };

    const response = await fetch(`${baseUrl}/v1/servers`, {
      headers,
    });
    
    if (response.status === 401) {
      TokenService.clearToken();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch servers: ${response.statusText}`);
    }

    return await response.json();
  }

  static async login(username: string, password: string): Promise<string> {
    const response = await fetch(`${baseUrl}/v1/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401) {
      throw new Error("Username or password isn't correct");
    }

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error('No token received from server');
    }

    return data.token;
  }
}
