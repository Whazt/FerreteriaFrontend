import { useState, useEffect } from "react";
import type { Usuario, UsuarioFormData } from "../../types/usuario";

type Props = {
    open: boolean;
    onClose: () => void;
    initialData: Usuario | null;
    onSubmit: (data: UsuarioFormData) => Promise<void>;
};

export default function UsuarioFormModal({ open, onClose, initialData, onSubmit }: Props) {
    const [form, setForm] = useState<UsuarioFormData>({
        email: "",
        rolId: 2, // Valor por defecto: User
        password: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                email: initialData.email,
                rolId: initialData.rolId,
                password: "" // No rellenamos password al editar
            });
        } else {
            setForm({ email: "", rolId: 2, password: "" });
        }
    }, [initialData, open]);

    // Actualizamos el tipo del evento para aceptar inputs y selects
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "rolId" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend: UsuarioFormData = { ...form };
            // Si estamos editando (existe initialData), aseguramos que no se envíe password
            if (initialData) {
                delete dataToSend.password;
            } else {
                 if (!dataToSend.password) delete dataToSend.password;
            }

            await onSubmit(dataToSend);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? "Editar Usuario" : "Nuevo Usuario"}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    {/* Solo mostramos el campo de contraseña si estamos creando un usuario nuevo */}
                    {!initialData && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={form.password || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="••••••"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select
                            name="rolId"
                            required
                            value={form.rolId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value={1}>Admin</option>
                            <option value={2}>User</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}