import { useState, useEffect } from "react";
import type { PedidoCreatePayload, PedidoItemInput, MetodoPago, TipoEntrega } from "../../types/pedidos";
import { useProducts } from "../../hooks/useProduct";
import { useClientes } from "../../hooks/useCliente";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PedidoCreatePayload) => Promise<void>;
};

const initialForm = {
    clienteId: 0, // ID del cliente en la BD
    usuarioId: 0, // ID del usuario asociado al cliente (necesario para el backend)
    metodoPago: "efectivo_local" as MetodoPago,
    tipoEntrega: "retiro_sucursal" as TipoEntrega,
    gastoEnvio: 0
};

export default function PedidoFormModal({ open, onClose, onSubmit }: Props) {
    const { productos, fetchProductos } = useProducts();
    const { clientes, fetchClientes } = useClientes();
    
    const [cabecera, setCabecera] = useState(initialForm);
    const [items, setItems] = useState<PedidoItemInput[]>([]);
    const [loading, setLoading] = useState(false);

    // Item actual siendo agregado
    const [currentItem, setCurrentItem] = useState({ productoId: "", cantidad: 1 });

    useEffect(() => {
        if (open) {
            fetchProductos(1, 100);
            fetchClientes(); // Asegurarse de cargar clientes
            setCabecera(initialForm);
            setItems([]);
        }
    }, [open]);

    // Manejo de cliente seleccionado
    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cId = Number(e.target.value);
        const cliente = clientes.find((c: any) => c.id === cId);
        if (cliente) {
            setCabecera(prev => ({
                ...prev,
                clienteId: cId,
                usuarioId: cliente.usuarioId // Guardamos el usuarioId que pide el backend
            }));
        }
    };

    const handleAddItem = () => {
        if (!currentItem.productoId) return alert("Seleccione un producto");
        if (currentItem.cantidad <= 0) return alert("Cantidad inválida");

        // Validar stock
        const prod = productos.find((p: any) => p.codProducto === currentItem.productoId);
        if (prod && Number(prod.existencias) < currentItem.cantidad) {
            return alert(`Stock insuficiente. Solo hay ${prod.existencias}`);
        }

        const exists = items.findIndex(i => i.productoId === currentItem.productoId);
        if (exists >= 0) {
            const newItems = [...items];
            newItems[exists].cantidad += Number(currentItem.cantidad);
            setItems(newItems);
        } else {
            setItems([...items, { ...currentItem, cantidad: Number(currentItem.cantidad) }]);
        }
        setCurrentItem({ productoId: "", cantidad: 1 });
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cabecera.usuarioId === 0) return alert("Seleccione un cliente");
        if (items.length === 0) return alert("Agregue productos");

        setLoading(true);
        try {
            await onSubmit({
                usuarioId: cabecera.usuarioId,
                productos: items,
                metodoPago: cabecera.metodoPago,
                tipoEntrega: cabecera.tipoEntrega,
                gastoEnvio: cabecera.tipoEntrega === 'envio' ? 150 : 0 // Ejemplo simple
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cálculos para vista previa
    const total = items.reduce((acc, item) => {
        const p = productos.find((prod: any) => prod.codProducto === item.productoId);
        const precio = p ? Number(p.precio) : 0;
        return acc + (precio * item.cantidad);
    }, 0);
    const totalConIva = total * 1.15;
    const envio = cabecera.tipoEntrega === 'envio' ? 150 : 0;
    const granTotal = totalConIva + envio;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Nuevo Pedido</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Selección Cliente */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                            <select
                                value={cabecera.clienteId}
                                onChange={handleClienteChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                            >
                                <option value={0}>Seleccione Cliente...</option>
                                {clientes.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombres} {c.apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Entrega</label>
                            <select
                                value={cabecera.tipoEntrega}
                                onChange={(e) => setCabecera({...cabecera, tipoEntrega: e.target.value as TipoEntrega})}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                            >
                                <option value="retiro_sucursal">Retiro en Sucursal</option>
                                <option value="envio">Envío a Domicilio (C$150)</option>
                            </select>
                        </div>
                    </div>

                    {/* Agregar Productos */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-8">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                                <select
                                    value={currentItem.productoId}
                                    onChange={(e) => setCurrentItem({...currentItem, productoId: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm bg-white"
                                >
                                    <option value="">Seleccione...</option>
                                    {productos.map((p: any) => (
                                        <option key={p.codProducto} value={p.codProducto}>
                                            {p.producto} - C${Number(p.precio).toFixed(2)} (Disp: {p.existencias})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Cant.</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={currentItem.cantidad}
                                    onChange={(e) => setCurrentItem({...currentItem, cantidad: Number(e.target.value)})}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button onClick={handleAddItem} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 text-sm font-medium">
                                    + Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista */}
                    <table className="w-full text-sm text-left text-gray-500 border mb-4">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2 text-right">Cant.</th>
                                <th className="px-4 py-2 text-right">Precio</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                                <th className="px-4 py-2 text-center">x</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => {
                                const prod = productos.find((p: any) => p.codProducto === item.productoId);
                                const precio = prod ? Number(prod.precio) : 0;
                                return (
                                    <tr key={idx} className="border-b">
                                        <td className="px-4 py-2">{prod?.producto}</td>
                                        <td className="px-4 py-2 text-right">{item.cantidad}</td>
                                        <td className="px-4 py-2 text-right">C${precio.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right">C${(precio * item.cantidad).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center"><button onClick={() => handleRemoveItem(idx)} className="text-red-500 font-bold">×</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="text-right text-sm space-y-1">
                        <p>Subtotal (neto): C${total.toFixed(2)}</p>
                        <p>IVA (15%): C${(total * 0.15).toFixed(2)}</p>
                        <p>Envío: C${envio.toFixed(2)}</p>
                        <p className="text-xl font-bold text-orange-600">Total: C${granTotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded" disabled={loading}>Cancelar</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded" disabled={loading}>
                        {loading ? "Creando..." : "Crear Pedido"}
                    </button>
                </div>
            </div>
        </div>
    );
}