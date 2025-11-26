import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginModal({ onClose, onRegister }: { onClose: () => void; onRegister: () => void }) {
    const { login, isLoading, error } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await login({ email, password });
        onClose();
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-100  flex justify-center items-center">
        <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" className="w-full border p-2 rounded" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded" disabled={isLoading}>
                {isLoading ? "Cargando..." : "Entrar"}
            </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <p className="mt-4 text-sm text-center">
            ¿No tienes cuenta?{" "}
            <button onClick={onRegister} className="text-blue-600 underline">
                Regístrate aquí
            </button>
            </p>
            <button onClick={onClose} className="mt-4 text-gray-600">Cerrar</button>
        </div>
        </div>
    );
}
