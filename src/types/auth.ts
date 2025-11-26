// --- Entradas ---

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono: string;
}

// --- Salidas ---

// El backend de login devuelve directamente el accesToken como un string
export type LoginResponse = string; 

export interface RegisterResponse {
  id: number;
  nombres: string;
  apellidos: string;
}

// El backend de refreshAccessToken devuelve un objeto con el accesToken
export interface RefreshTokenResponse {
  accesToken: string;
}

// --- Estado del Cliente (decodificado del token) ---

export interface UserState {
  id: number;
  email: string;
  rol: number;
}