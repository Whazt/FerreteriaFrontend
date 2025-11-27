import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

export default function AppCartSync() {
    const accessToken = useAuthStore((s) => s.accessToken);
    const { loadCart, sincronizar } = useCartStore();

    useEffect(() => {
        let mounted = true;

        const sync = async () => {
        try {
            if (accessToken) {
            // Al iniciar sesión: migra local -> backend y luego recarga
            await sincronizar();
            if (mounted) await loadCart();
            } else {
            // Al cerrar sesión o token inválido: recarga local
            if (mounted) await loadCart();
            }
        } catch (err) {
            // Evitamos romper la UI ante errores
            await loadCart();
        }
        };

        sync();

        return () => {
        mounted = false;
        };
    }, [accessToken, loadCart, sincronizar]);

    return null;
}
