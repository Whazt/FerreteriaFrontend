import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
    const { register, isLoading, error } = useAuthStore();
    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        password: "",
    });

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Registro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input name="nombres" placeholder="Nombres" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="apellidos" placeholder="Apellidos" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="email" type="email" placeholder="Correo" onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded" disabled={isLoading}>
                {isLoading ? "Cargando..." : "Registrarse"}
            </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button onClick={onClose} className="mt-4 text-gray-600">Cerrar</button>
        </div>
        </div>
    );
}
