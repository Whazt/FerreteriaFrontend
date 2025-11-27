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
        <div className="fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50">
        <div className="bg-white p-6 w-full max-w-md min-h-[60vh] rounded-lg shadow-lg relative">
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
            Registro
            </h2>

            {error && (
            <p className="text-red-500 mt-4 mb-4 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <input
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                placeholder="Nombres"
                className="w-full border p-3 rounded text-lg"
            />
            <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                className="w-full border p-3 rounded text-lg"
            />
            <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full border p-3 rounded text-lg"
            />
            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo"
                className="w-full border p-3 rounded text-lg"
            />
            <div className="relative">
                <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
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
                {isLoading ? "Cargando..." : "Registrarse"}
            </button>
            </form>
        </div>
        </div>
    );
}
