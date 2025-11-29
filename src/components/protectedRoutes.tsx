import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
    const { user, accessToken } = useAuthStore();

    // 1. Si no hay token (y App.tsx ya terminó de intentar restaurar sesión), redirigir al inicio
    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    // 2. Si hay token pero el usuario aún no está en el estado (latencia mínima de decodificación), mostrar loader
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 3. Validación de Rol Admin (si se requiere)
    if (requireAdmin) {
        if (user.rolId !== 1) {
            // Si no es admin, lo mandamos al inicio (o podrías mandarlo a una página de "Acceso Denegado")
            return <Navigate to="/" replace />;
        }
    }

    // 4. Si pasa todas las validaciones, renderizar el contenido protegido
    return <>{children}</>;
};