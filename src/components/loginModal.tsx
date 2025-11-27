import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function LoginModal({
    onClose,
    onRegister,
    }: {
    onClose: () => void;
    onRegister: () => void;
    }) {
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await login({ email, password });
        // await sincronizar(); // 🔹 Sincronizamos carrito al loguear
        onClose();
        } catch (err) {
        setErrorMessage("Error en el correo o contraseña");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50">
        <div className="bg-white p-6 w-full max-w-md min-h-[50vh] rounded-lg shadow-lg relative">
            {/* 🔹 Botón cerrar arriba a la derecha */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
            <FaTimes />
            </button>

            {/* 🔹 Imagen centrada */}
            <div className="flex justify-center mb-6">
            <img src="/salomonlogo.png" alt="Logo" />
            </div>

            {/* 🔹 Texto debajo de la imagen */}
            <h2 className="text-2xl font-bold text-orange-400 text-center uppercase mb-5">
            Inicio de sesión
            </h2>
            {errorMessage && (
            <p className="text-red-500 mt-4 mb-4 text-center">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="w-full border p-3 rounded text-lg"
            />
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full border p-3 rounded text-lg pr-12"
                />
                <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-600 text-lg"
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <button
                type="submit"
                className="w-full bg-orange-400 text-white py-3 rounded text-lg hover:bg-orange-500"
                disabled={isLoading}
            >
                {isLoading ? "Cargando..." : "Entrar"}
            </button>
            </form>

            {/* 🔹 Link en naranja */}
            <p className="mt-6 text-sm text-center">
            ¿No tienes cuenta?{" "}
            <button
                onClick={onRegister}
                className="text-orange-400 hover:text-orange-500 underline font-semibold"
            >
                Regístrate aquí
            </button>
            </p>
        </div>
        </div>
    );
}
