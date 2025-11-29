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
            onClose();
        } catch (err) {
            setErrorMessage("Error en el correo o contraseña");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-2xl relative animate-fade-in">
                
                {/* 🔹 Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                    <FaTimes size={20} />
                </button>

                {/* 🔹 Header con Logo */}
                <div className="flex flex-col items-center mb-6 mt-2">
                    <img src="/salomonlogo.png" alt="Logo" className="h-16 w-auto object-contain mb-3" />
                    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                        Bienvenido
                    </h2>
                    <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
                </div>

                {/* 🔹 Mensaje de Error */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm py-2 px-4 rounded-lg mb-6 text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                {/* 🔹 Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl pr-12 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md hover:shadow-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando...
                            </span>
                        ) : "Iniciar Sesión"}
                    </button>
                </form>

                {/* 🔹 Footer Link */}
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta?{" "}
                        <button
                            onClick={onRegister}
                            className="text-orange-500 hover:text-orange-600 font-bold hover:underline transition-colors"
                        >
                            Regístrate gratis
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}