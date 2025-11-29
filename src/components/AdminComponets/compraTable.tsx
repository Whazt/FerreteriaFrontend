import { useState } from "react";
import type { Compra } from "../../types/compra";
import { TrashIcon } from "../icons";

// Iconos adicionales locales para este componente
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

type Props = {
    compras: Compra[];
    loading?: boolean;
    onDelete: (id: number) => void;
    onAplicar: (id: number) => void;
    onVerDetalles: (compra: Compra) => void;
};

// Tipo para manejar la acción de confirmación
type ConfirmAction = {
    type: 'delete' | 'aplicar';
    compra: Compra;
} | null;

export default function CompraTable({ compras, loading, onDelete, onAplicar, onVerDetalles }: Props) {
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

    const handleConfirm = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'delete') {
            onDelete(confirmAction.compra.id);
        } else {
            onAplicar(confirmAction.compra.id);
        }
        setConfirmAction(null);
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando compras...</div>;
    if (compras.length === 0) return <div className="p-4 text-center text-gray-500">No hay compras registradas.</div>;

    return (
        <div className="w-full relative">
            
            {/* ==========================================
                VISTA MÓVIL (< 768px) - Cards
               ========================================== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {compras.map((item) => {
                    const total = Number(item.subtotal) + Number(item.iva);
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">ID #{item.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    item.estado === 'aplicada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.estado.toUpperCase()}
                                </span>
                            </div>
                            
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Proveedor</span>
                                <p className="text-gray-900 font-medium">{item.proveedor?.nombre || `ID: ${item.proveedorId}`}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Fecha</span>
                                    <p className="text-gray-600 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                                    <p className="text-gray-900 font-bold text-lg">C${total.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                                <button onClick={() => onVerDetalles(item)} className="flex-1 flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                                    <EyeIcon />
                                </button>
                                {item.estado === 'registrada' && (
                                    <button 
                                        onClick={() => setConfirmAction({ type: 'aplicar', compra: item })}
                                        className="flex-1 flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                    >
                                        <CheckIcon />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setConfirmAction({ type: 'delete', compra: item })}
                                    className="flex-1 flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ==========================================
                VISTA DESKTOP (>= 768px) - Tabla
               ========================================== */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Proveedor</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {compras.map((item) => {
                                const total = Number(item.subtotal) + Number(item.iva);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">#{item.id}</td>
                                        <td className="px-6 py-4">{item.proveedor?.nombre || `ID: ${item.proveedorId}`}</td>
                                        <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            C${total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.estado === 'aplicada' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.estado.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                                            <button 
                                                onClick={() => onVerDetalles(item)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" 
                                                title="Ver Detalles"
                                            >
                                                <EyeIcon />
                                            </button>
                                            
                                            {item.estado === 'registrada' && (
                                                <button 
                                                    onClick={() => setConfirmAction({ type: 'aplicar', compra: item })}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" 
                                                    title="Aplicar al Inventario"
                                                >
                                                    <CheckIcon />
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => setConfirmAction({ type: 'delete', compra: item })}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" 
                                                title="Eliminar / Revertir"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==========================================
                MODAL DE CONFIRMACIÓN
               ========================================== */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
                                confirmAction.type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {confirmAction.type === 'delete' ? <TrashIcon /> : <CheckIcon />}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900">
                                {confirmAction.type === 'delete' ? '¿Eliminar Compra?' : '¿Aplicar Compra?'}
                            </h3>
                            
                            <p className="mt-2 text-sm text-gray-500">
                                {confirmAction.type === 'delete' ? (
                                    <>
                                        Estás a punto de eliminar la compra <strong>#{confirmAction.compra.id}</strong>.
                                        {confirmAction.compra.estado === 'aplicada' && (
                                            <span className="block mt-2 font-semibold text-red-600">
                                                ⚠ ATENCIÓN: Esta compra ya fue aplicada. Eliminarla revertirá el stock y los costos.
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        Vas a aplicar la compra <strong>#{confirmAction.compra.id}</strong> al inventario.
                                        <br />
                                        Esto actualizará las existencias y promediará los costos de los productos.
                                    </>
                                )}
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-6 justify-center">
                            <button 
                                onClick={() => setConfirmAction(null)} 
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirm} 
                                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                    confirmAction.type === 'delete' 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {confirmAction.type === 'delete' ? 'Sí, eliminar' : 'Sí, aplicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}