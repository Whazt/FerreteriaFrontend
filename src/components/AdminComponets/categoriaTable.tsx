import { useState } from "react";
import type { Categoria } from "../../types/categoria";
import { EditIcon, TrashIcon } from "../icons";

type Props = {
    categorias: Categoria[];
    loading?: boolean;
    onEdit: (categoria: Categoria) => void;
    onDelete: (id: number) => void;
};

export default function CategoriaTable({ categorias, loading, onEdit, onDelete }: Props) {
    const [itemAEliminar, setItemAEliminar] = useState<Categoria | null>(null);

    const confirmarEliminacion = () => {
        if (itemAEliminar) {
            onDelete(itemAEliminar.id);
            setItemAEliminar(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando categorías...</div>;
    if (categorias.length === 0) return <div className="p-4 text-center text-gray-500">No hay categorías registradas.</div>;

    return (
        <div className="w-full relative">
            {/* ==========================================
                VISTA MÓVIL (< 768px) - Cards
               ========================================== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {categorias.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">ID #{item.id}</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Categoría</span>
                            <p className="text-gray-900 font-semibold text-lg">{item.categoria}</p>
                        </div>
                        {item.descripcion && (
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Descripción</span>
                                <p className="text-gray-600 text-sm">{item.descripcion}</p>
                            </div>
                        )}
                        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => onEdit(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-md font-medium hover:bg-yellow-600 active:scale-95 transition-all"
                            >
                                <EditIcon /> Editar
                            </button>
                            <button
                                onClick={() => setItemAEliminar(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 active:scale-95 transition-all"
                            >
                                <TrashIcon /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==========================================
                VISTA DESKTOP (>= 768px) - Tabla
               ========================================== */}
            <div className="hidden md:block w-full">
                <div className="overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4 w-20">ID</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4">Descripción</th>
                                    <th className="px-6 py-4 text-center w-40">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categorias.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.categoria}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.descripcion}>
                                            {item.descripcion || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                                                title="Editar"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                onClick={() => setItemAEliminar(item)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Eliminar"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ==========================================
                MODAL DE CONFIRMACIÓN
               ========================================== */}
            {itemAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                                <TrashIcon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">¿Eliminar categoría?</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Vas a eliminar <strong>"{itemAEliminar.categoria}"</strong>.
                                <br />
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6 justify-center">
                            <button
                                onClick={() => setItemAEliminar(null)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarEliminacion}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}