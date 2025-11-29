import type { 
    LoginCredentials, 
    RegisterCredentials, 
    LoginResponse, 
    RegisterResponse,
    RefreshTokenResponse
} from '../types/auth';

// Ajusta esta URL a tu API
const API_BASE_URL = import.meta.env.VITE_API_URL; 

// Función de utilidad para manejar peticiones y errores
// 'include' es VITAL para que el navegador envíe y reciba cookies HTTP-Only.
const handleRequest = async <T>(url: string, options: RequestInit): Promise<T> => {
    const defaultOptions: RequestInit = {
        ...options,
        credentials: 'include', // NECESARIO para HTTP-Only Cookies
        headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        },
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
        let errorData: any;
        try {
        errorData = await response.json();
        } catch {
        errorData = { message: `Error ${response.status}: ${response.statusText}` };
        }
        // El backend usa 'error' para el mensaje en caso de error
        throw new Error(errorData.error || errorData.message || 'Error en la petición');
    }
    
    // En algunos casos (como logout), el cuerpo puede estar vacío (200 OK con mensaje)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        // @ts-ignore: Para manejar casos donde no hay cuerpo (e.g., Logout)
        return { mensaje: 'Operación exitosa' } as T;
    }

    // Retorna el cuerpo JSON tipado
    return response.json() as Promise<T>;
    };

    export const authService = {
    
    // 1. Iniciar Sesión (establece la cookie refreshToken, devuelve el accessToken en el body)
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        // El backend devuelve el accessToken puro (string)
        const accesToken = await handleRequest<string>(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        });
        return accesToken;
    },

    // 2. Registrar Usuario
    register: async (data: RegisterCredentials): Promise<RegisterResponse> => {
        return handleRequest<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        });
    },

    // 3. Refrescar Token (el navegador adjunta la cookie refreshToken)
    refreshAccessToken: async (): Promise<RefreshTokenResponse> => {
        return handleRequest<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        // No necesita body, confía en la cookie
        });
    },

    // 4. Cerrar Sesión (elimina la cookie refreshToken en el backend)
    logout: async (): Promise<void> => {
        // La respuesta esperada del backend es un 200/204 con un mensaje, no un cuerpo JSON.
        await handleRequest<any>(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        });
        // La función handleRequest devuelve void o un mensaje de éxito
    }
};