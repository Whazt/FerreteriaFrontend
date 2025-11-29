import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { 
    LoginCredentials, 
    RegisterCredentials, 
    UserState 
} from '../types/auth';
// Asegúrate de instalar esta dependencia: npm install jwt-decode
import { jwtDecode } from 'jwt-decode'; 


// Interfaz para la data decodificada del token
interface DecodedToken {
    id: number;
    email: string;
    rol: number;
    iat: number;
    exp: number;
}

interface AuthState {
  // Solo guardamos el accessToken localmente para peticiones protegidas
    accessToken: string | null; 
    user: UserState | null;
    isLoading: boolean;
    error: string | null;
    
    // Acciones
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterCredentials) => Promise<void>;
    refreshAccessToken: () => Promise<boolean>;
    logout: () => Promise<void>;
    setUserFromToken: (token: string) => void;
}


export const useAuthStore = create<AuthState>()(
    devtools(
        // Persistimos el accessToken para que se mantenga al recargar la página
        persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            isLoading: false,
            error: null,

            // Función auxiliar para decodificar y establecer el usuario
            setUserFromToken: (token: string) => {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                const userState: UserState = {
                id: decoded.id,
                email: decoded.email,
                rolId: decoded.rol,
                };
                set({ user: userState });
            } catch (e) {
                console.error('Error al decodificar el token:', e);
                // Si el token es inválido o expirado localmente, limpiamos todo
                set({ user: null, accessToken: null });
            }
            },

            // 1. Acción de Login
            login: async (credentials: LoginCredentials) => {
            set({ isLoading: true, error: null });
            try {
                // Recibimos solo el accessToken. La cookie refreshToken se estableció automáticamente.
                const accesToken = await authService.login(credentials);
                
                get().setUserFromToken(accesToken); 
                
                set({ 
                accessToken: accesToken, 
                isLoading: false 
                });

            } catch (err: any) {
                set({ 
                accessToken: null, 
                user: null, 
                isLoading: false, 
                error: err.message || 'Fallo la autenticación' 
                });
                throw err;
            }
        },

        // 2. Acción de Registro
        register: async (data: RegisterCredentials) => {
            set({ isLoading: true, error: null });
            try {
                // El registro no devuelve tokens
                await authService.register(data); 
                set({ isLoading: false, error: null });
            } catch (err: any) {
                set({ 
                    isLoading: false, 
                    error: err.message || 'Fallo el registro' 
                });
                throw err;
            }
        },

        // 3. Acción para Refrescar Token
        refreshAccessToken: async (): Promise<boolean> => {
            // No necesitamos revisar el refreshToken localmente, la llamada al servicio se encarga
            // de usar la cookie.
            try {
                const { accesToken } = await authService.refreshAccessToken();
                
                get().setUserFromToken(accesToken);
                set({ accessToken: accesToken });
                
                return true; // Token refrescado con éxito
            } catch (err) {
                // Si falla el refresh (token expirado en la cookie o inválido)
                console.error('Error al refrescar el token:', err);
                await get().logout(); // Forzar el cierre de sesión local y en backend
                return false;
            }
        },

        // 4. Acción de Logout
        logout: async () => {
            try {
                // Llama al servicio para que el backend elimine la cookie HTTP-Only
                await authService.logout();
            } catch (error) {
                console.error('Error al cerrar sesión en el backend, limpiando localmente:', error);
                // Continuamos limpiando el estado local a pesar del error de la API
            }

            // Limpieza de estado local
            set({ 
                accessToken: null, 
                user: null,
                error: null,
                isLoading: false
            });
            },
        }),
        {
            name: 'auth-storage', 
            // Solo persistimos el accessToken localmente
            partialize: (state) => ({ 
                accessToken: state.accessToken, 
            }), 
            // Lógica para rehidratar el estado: decodificar el token al cargar la app
            onRehydrateStorage: (state) => {
                // El estado 'state' es el estado rehidratado del localStorage
                if (state?.accessToken) {
                    state.setUserFromToken(state.accessToken);
                }
            },
        }
    )
    )
);