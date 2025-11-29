import { useState, useEffect } from "react";
import type { Categoria, CategoriaFormData } from "../../types/categoria";

type Props = {
    open: boolean;
    onClose: () => void;
    initialData: Categoria | null;
    onSubmit: (data: CategoriaFormData) => Promise<void>;
};

export default function CategoriaFormModal({ open, onClose, initialData, onSubmit }: Props) {
    // Estado inicial del formulario
    const [formData, setFormData] = useState<CategoriaFormData>({ categoria: "", descripcion: "" });
    const [loading, setLoading] = useState(false);

    // Efecto para rellenar el formulario si estamos editando
    useEffect(() => {
        if (initialData) {
            setFormData({ 
                categoria: initialData.categoria, 
                descripcion: initialData.descripcion || "" 
            });
        } else {
            // Limpiar formulario si es nuevo registro
            setFormData({ categoria: "", descripcion: "" });
        }
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose(); // Cerrar modal al guardar exitosamente
        } catch (error) {
            console.error(error);
            // Aquí podrías manejar errores de validación si el backend los devuelve
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                {/* Cabecera */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? "Editar Categoría" : "Nueva Categoría"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la Categoría <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            name="categoria"
                            value={formData.categoria}
                            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
                            placeholder="Ej: Herramientas, Materiales..."
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none h-24 transition-shadow"
                            placeholder="Breve descripción de la categoría..."
                        />
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}