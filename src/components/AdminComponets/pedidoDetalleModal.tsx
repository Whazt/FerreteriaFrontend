import { useEffect } from "react";
import type { Pedido } from "../../types/pedidos";
import { useProducts } from "../../hooks/useProduct";
import { useClientes } from "../../hooks/useCliente";

type Props = {
    pedido: Pedido | null;
    onClose: () => void;
};

export default function PedidoDetalleModal({ pedido, onClose }: Props) {
    const { productos } = useProducts();
    const { clientes, fetchClientes } = useClientes();

    useEffect(() => {
        if (pedido) {
            fetchClientes();
        }
    }, [pedido]);

    if (!pedido) return null;

    const total = Number(pedido.subtotal) + Number(pedido.iva) + Number(pedido.gastoEnvio);

    // Lógica para el nombre del cliente
    let nombreCliente = "N/A";
    if (pedido.cliente) {
        nombreCliente = `${pedido.cliente.nombres} ${pedido.cliente.apellidos}`;
    } else {
        const clienteEncontrado = clientes.find(c => c.id === pedido.clienteId);
        if (clienteEncontrado) {
            nombreCliente = `${clienteEncontrado.nombres} ${clienteEncontrado.apellidos}`;
        } else {
            nombreCliente = `Cliente ID: ${pedido.clienteId}`;
        }
    }

    // Helper para colores de estado (Consistente con la tabla)
    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'pagado': return 'bg-blue-100 text-blue-800';
            case 'enviado': return 'bg-indigo-100 text-indigo-800'; // O green si prefieres
            case 'cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Pedido #{pedido.id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <span className="block text-gray-500">Cliente</span>
                            <span className="font-medium text-gray-900 text-lg">
                                {nombreCliente}
                            </span>
                            
                            <span className="block text-gray-500 mt-2">Método Pago</span>
                            <span className="font-medium text-gray-900 capitalize">{pedido.metodoPago.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-gray-500">Estado</span>
                            {/* CORRECCIÓN: Usamos la función helper para asignar el color correcto basado en los estados reales */}
                            <span className={`font-bold uppercase px-2 py-0.5 rounded text-xs ${getStatusColor(pedido.estado)}`}>
                                {pedido.estado}
                            </span>
                            <span className="block text-gray-500 mt-2">Entrega</span>
                            <span className="font-medium text-gray-900 capitalize">{pedido.tipoEntrega.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2 text-right">Cant.</th>
                                <th className="px-4 py-2 text-right">Precio</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.detalles?.map((detalle) => {
                                const prod = productos.find(p => p.codProducto === detalle.productoId);
                                const nombre = prod ? prod.producto : detalle.productoId;
                                
                                return (
                                    <tr key={detalle.id} className="border-b">
                                        <td className="px-4 py-2 font-medium text-gray-900">{nombre}</td>
                                        <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                                        <td className="px-4 py-2 text-right">C${Number(detalle.precio).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right font-medium">C${(Number(detalle.precio) * detalle.cantidad).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right space-y-1 bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 flex justify-between  gap-8">
                            <span>Subtotal:</span> 
                            <span>C${Number(pedido.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between gap-8">
                            <span>IVA:</span>
                            <span>C${Number(pedido.iva).toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between gap-8">
                            <span>Envío:</span>
                            <span>C${Number(pedido.gastoEnvio).toFixed(2)}</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900 border-t pt-2 mt-2 flex justify-between  gap-8">
                            <span>Total:</span>
                            <span>C${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}