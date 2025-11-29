import { useState, useEffect } from "react";
import type { Cliente, ClienteFormData } from "../../types/cliente";
import { useUsuarios } from "../../hooks/useUsuario";

type Props = {
    open: boolean;
    onClose: () => void;
    initialData: Cliente | null;
    onSubmit: (data: ClienteFormData) => Promise<void>;
};

const initialFormState: ClienteFormData = {
    nombres: "",
    apellidos: "",
    telefono: "",
    usuarioId: 0
};

export default function ClienteFormModal({ open, onClose, initialData, onSubmit }: Props) {
    const [formData, setFormData] = useState<ClienteFormData>(initialFormState);
    const [loading, setLoading] = useState(false);
    
    // Obtenemos usuarios y la función para recargarlos manualmente
    const { usuarios, fetchUsuarios } = useUsuarios();

    // Efecto para cargar los usuarios al abrir el modal
    useEffect(() => {
        if (open) {
            // Pedimos la página 1 con un límite alto (100) para llenar el select
            fetchUsuarios(1, 100);
        }
    }, [open]);

    // Efecto para llenar el formulario si estamos editando
    useEffect(() => {
        if (initialData) {
            setFormData({ 
                nombres: initialData.nombres, 
                apellidos: initialData.apellidos,
                telefono: initialData.telefono,
                usuarioId: initialData.usuarioId
            });
        } else {
            setFormData(initialFormState);
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "usuarioId" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.usuarioId || formData.usuarioId === 0) {
            alert("Por favor seleccione un usuario asociado.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? "Editar Cliente" : "Nuevo Cliente"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Grid para Nombres y Apellidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                            <input
                                name="nombres"
                                type="text"
                                required
                                value={formData.nombres}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Juan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                name="apellidos"
                                type="text"
                                required
                                value={formData.apellidos}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            name="telefono"
                            type="text"
                            required
                            maxLength={8}
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="88888888"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario Asociado</label>
                        <select
                            name="usuarioId"
                            required
                            value={formData.usuarioId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value={0}>Seleccione un usuario...</option>
                            {/* Usamos 'any' para evitar conflictos de tipos si tu hook devuelve algo distinto a la interfaz Cliente */}
                            {usuarios.map((u: any) => (
                                <option key={u.id} value={u.id}>
                                    {u.email} (ID: {u.id})
                                </option>
                            ))}
                        </select>
                        {usuarios.length === 0 && (
                            <p className="text-xs text-orange-500 mt-1">Cargando usuarios o lista vacía...</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}