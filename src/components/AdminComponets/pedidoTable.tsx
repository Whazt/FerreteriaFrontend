import { useState } from "react";
import type { Pedido, EstadoPedido } from "../../types/pedidos";
import { TrashIcon } from "../icons";

// Icono Ojo (Ver detalles)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

type Props = {
    pedidos: Pedido[];
    loading?: boolean;
    onDelete: (id: number) => void;
    onUpdateEstado: (id: number, estado: EstadoPedido) => void;
    onVerDetalles: (pedido: Pedido) => void;
};

const statusColors: Record<EstadoPedido, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    pagado: "bg-blue-100 text-blue-800",
    enviado: "bg-indigo-100 text-indigo-800",
    cancelado: "bg-red-100 text-red-800",
};

export default function PedidoTable({ pedidos, loading, onDelete, onUpdateEstado, onVerDetalles }: Props) {
    // Estado para controlar el modal de confirmación de eliminación
    const [pedidoAEliminar, setPedidoAEliminar] = useState<Pedido | null>(null);

    const handleStatusChange = (id: number, newStatus: string) => {
        // Para cambio de estado mantenemos el confirm simple o podríamos hacer otro modal,
        // pero respetando tu solicitud, nos enfocamos en el Delete.
        if (window.confirm(`¿Cambiar estado a ${newStatus}?`)) {
            onUpdateEstado(id, newStatus as EstadoPedido);
        }
    };

    const confirmarEliminacion = () => {
        if (pedidoAEliminar) {
            onDelete(pedidoAEliminar.id);
            setPedidoAEliminar(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando pedidos...</div>;
    if (pedidos.length === 0) return <div className="p-4 text-center text-gray-500">No hay pedidos registrados.</div>;

    return (
        <div className="w-full relative">
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pedidos.map((item) => {
                                const total = Number(item.subtotal) + Number(item.iva) + Number(item.gastoEnvio);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">#{item.id}</td>
                                        <td className="px-6 py-4">
                                            {item.cliente 
                                                ? `${item.cliente.nombres} ${item.cliente.apellidos}`
                                                : `Cliente ID ${item.clienteId}`}
                                        </td>
                                        <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            C${total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={item.estado}
                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                className={`px-2 py-1 rounded text-xs font-semibold border-none focus:ring-2 focus:ring-orange-200 cursor-pointer ${statusColors[item.estado]}`}
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="pagado">Pagado</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                                            <button 
                                                onClick={() => onVerDetalles(item)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" 
                                                title="Ver Detalles"
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button 
                                                onClick={() => setPedidoAEliminar(item)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" 
                                                title="Eliminar"
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
            
            {/* Vista móvil simplificada */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {pedidos.map((item) => {
                    const total = Number(item.subtotal) + Number(item.iva) + Number(item.gastoEnvio);
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-700">#{item.id}</span>
                                <span className={`text-xs px-2 py-1 rounded ${statusColors[item.estado]}`}>{item.estado}</span>
                            </div>
                            <div className="text-sm mb-2">
                                <p className="font-medium">{item.cliente?.nombres} {item.cliente?.apellidos}</p>
                                <p className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2 border-t pt-2">
                                <span className="font-bold text-lg">C${total.toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => onVerDetalles(item)} className="p-2 bg-blue-100 rounded text-blue-600"><EyeIcon/></button>
                                    <button onClick={() => setPedidoAEliminar(item)} className="p-2 bg-red-100 rounded text-red-600"><TrashIcon/></button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ==========================================
                MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
               ========================================== */}
            {pedidoAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                                <TrashIcon />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900">¿Eliminar Pedido?</h3>
                            
                            <p className="mt-2 text-sm text-gray-500">
                                Vas a eliminar el pedido <strong>#{pedidoAEliminar.id}</strong> del cliente <strong>{pedidoAEliminar.cliente?.nombres || "Desconocido"}</strong>.
                                <br />
                                <span className="text-red-500 font-medium mt-1 block">Esta acción no se puede deshacer.</span>
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-6 justify-center">
                            <button 
                                onClick={() => setPedidoAEliminar(null)} 
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