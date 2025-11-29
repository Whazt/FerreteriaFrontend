import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
    const { register, isLoading, error } = useAuthStore();
    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Registro exitoso, ahora inicia sesión");
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-2xl relative animate-fade-in my-8">
                
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
                        Crear Cuenta
                    </h2>
                    <p className="text-sm text-gray-500">Únete a nosotros hoy</p>
                </div>

                {/* 🔹 Mensaje de Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm py-2 px-4 rounded-lg mb-6 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* 🔹 Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Grid Nombre/Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Nombres</label>
                            <input
                                name="nombres"
                                value={form.nombres}
                                onChange={handleChange}
                                placeholder="Juan"
                                className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Apellidos</label>
                            <input
                                name="apellidos"
                                value={form.apellidos}
                                onChange={handleChange}
                                placeholder="Pérez"
                                className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="88888888"
                            className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Contraseña</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
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
                        className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md hover:shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registrando...
                            </span>
                        ) : "Crear Cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}