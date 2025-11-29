import { useState } from "react";
import type { Ajuste } from "../../types/ajuste";
import { TrashIcon } from "../icons";

type Props = {
    ajustes: Ajuste[];
    loading?: boolean;
    onDelete: (id: number) => void;
};

export default function AjusteTable({ ajustes, loading, onDelete }: Props) {
    const [itemAEliminar, setItemAEliminar] = useState<Ajuste | null>(null);

    const confirmarEliminacion = () => {
        if (itemAEliminar) {
            onDelete(itemAEliminar.id);
            setItemAEliminar(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando movimientos...</div>;
    if (ajustes.length === 0) return <div className="p-4 text-center text-gray-500">No hay ajustes registrados.</div>;

    return (
        <div className="w-full relative">
            {/* VISTA MÓVIL (CARDS) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {ajustes.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">#{item.id} - {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                item.accion === 'aumento' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {item.accion === 'aumento' ? '+ ENTRADA' : '- SALIDA'}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Producto</span>
                            <p className="text-gray-900 font-medium">{item.producto?.producto || item.productoId}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <div>
                                <span className="block text-xs font-bold text-gray-500">Motivo</span>
                                <span className="text-gray-700">{item.tipoAjuste?.tipoAjuste || "N/A"}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-gray-500">Cantidad</span>
                                <span className="text-lg font-bold text-gray-800">{item.cantidad}</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 italic border-t border-gray-50 pt-2">
                            Obs: {item.observacion}
                        </div>
                        <button 
                            onClick={() => setItemAEliminar(item)}
                            className="w-full mt-2 flex items-center justify-center p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                            <TrashIcon /> <span className="ml-2 text-sm font-medium">Revertir Ajuste</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* VISTA DESKTOP (TABLA) */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4 text-center">Acción</th>
                                <th className="px-6 py-4 text-right">Cant.</th>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ajustes.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">#{item.id}</td>
                                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.producto?.producto || item.productoId}</td>
                                    <td className="px-6 py-4">{item.tipoAjuste?.tipoAjuste || "General"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            item.accion === 'aumento' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.accion.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-700">{item.cantidad}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{item.usuario?.email || `ID: ${item.usuarioId}`}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => setItemAEliminar(item)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" 
                                            title="Revertir este ajuste"
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

            {/* MODAL DE CONFIRMACIÓN */}
            {itemAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">¿Revertir Ajuste?</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Vas a eliminar el ajuste <strong>#{itemAEliminar.id}</strong>. 
                                <br />
                                Esto revertirá el stock del producto <strong>{itemAEliminar.producto?.producto}</strong> en <strong>{itemAEliminar.cantidad}</strong> unidades.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6 justify-center">
                            <button onClick={() => setItemAEliminar(null)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={confirmarEliminacion} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Sí, Revertir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}