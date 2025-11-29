import type { Pedido } from "../../types/pedidos";
import { useProducts } from "../../hooks/useProduct";

type Props = {
    pedido: Pedido | null;
    onClose: () => void;
};

export default function PedidoDetalleModal({ pedido, onClose }: Props) {
    const { productos } = useProducts();

    if (!pedido) return null;

    const total = Number(pedido.subtotal) + Number(pedido.iva) + Number(pedido.gastoEnvio);

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
                            <span className="font-medium text-gray-900">
                                {pedido.cliente ? `${pedido.cliente.nombres} ${pedido.cliente.apellidos}` : "N/A"}
                            </span>
                            <span className="block text-gray-500 mt-2">Método Pago</span>
                            <span className="font-medium text-gray-900 capitalize">{pedido.metodoPago.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-gray-500">Estado</span>
                            <span className="font-bold text-gray-900 uppercase">{pedido.estado}</span>
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
                                        <td className="px-4 py-2">{nombre}</td>
                                        <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                                        <td className="px-4 py-2 text-right">C${Number(detalle.precio).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right">C${(Number(detalle.precio) * detalle.cantidad).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right space-y-1">
                        <div className="text-sm text-gray-600">Subtotal: C${Number(pedido.subtotal).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">IVA: C${Number(pedido.iva).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Envío: C${Number(pedido.gastoEnvio).toFixed(2)}</div>
                        <div className="text-lg font-bold text-gray-900 border-t pt-2 mt-2">Total: C${total.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}