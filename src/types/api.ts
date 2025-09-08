export interface ServerResponse {
  name: string;
  distance: number;
}

export interface LoginResponse {
  token: string;
}

export interface ServerListResponse {
  servers: ServerResponse[];
}
