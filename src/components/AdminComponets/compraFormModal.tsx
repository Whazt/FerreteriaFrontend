import { useState } from "react";
import { useProveedores } from "../../hooks/useProveedor";
import { useProducts } from "../../hooks/useProduct"; 
import type { CompraItemInput, CompraCreatePayload } from "../../types/compra";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CompraCreatePayload) => Promise<void>;
};

export default function CompraFormModal({ open, onClose, onSubmit }: Props) {
    const { proveedores } = useProveedores();
    const { productos } = useProducts();
    const [loading, setLoading] = useState(false);

    // Estado del formulario cabecera
    const [proveedorId, setProveedorId] = useState<number>(0);

    // Estado para la lista de items
    const [items, setItems] = useState<CompraItemInput[]>([]);

    // Estado para la línea actual que se está agregando
    const [currentItem, setCurrentItem] = useState<CompraItemInput>({
        productoId: "",
        cantidad: 1,
        precio: 0
    });

    // Agregar item a la lista
    const handleAddItem = () => {
        if (!currentItem.productoId) return alert("Seleccione un producto");
        if (currentItem.cantidad <= 0) return alert("Cantidad inválida");
        
        // CORRECCIÓN: Validación estricta del precio/costo
        const precioNumerico = Number(currentItem.precio);
        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            return alert("El costo unitario debe ser un número válido mayor a 0.");
        }

        // Verificar si ya existe para sumar cantidad o agregar nuevo
        const existingIndex = items.findIndex(i => i.productoId === currentItem.productoId);
        
        if (existingIndex >= 0) {
            const newItems = [...items];
            newItems[existingIndex].cantidad += Number(currentItem.cantidad);
            // Actualizar precio al último ingresado (opcional, política de negocio)
            newItems[existingIndex].precio = precioNumerico; 
            setItems(newItems);
        } else {
            setItems([...items, { ...currentItem, cantidad: Number(currentItem.cantidad), precio: precioNumerico }]);
        }

        // Resetear inputs de linea
        setCurrentItem({ productoId: "", cantidad: 1, precio: 0 });
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (proveedorId === 0) return alert("Seleccione un proveedor");
        if (items.length === 0) return alert("Agregue al menos un producto");

        setLoading(true);
        try {
            await onSubmit({ proveedorId, items });
            // Limpiar todo al éxito
            setProveedorId(0);
            setItems([]);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cálculos de resumen
    const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Compra</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                {/* Body Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* Selección de Proveedor */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                        <select
                            value={proveedorId}
                            onChange={(e) => setProveedorId(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value={0}>Seleccione un proveedor...</option>
                            {proveedores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Agregar Productos */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                        <h3 className="text-sm font-bold text-blue-800 mb-3">Agregar Productos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-5">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                                <select
                                    value={currentItem.productoId}
                                    onChange={(e) => {
                                        const prod = productos.find(p => p.codProducto === e.target.value);
                                        // Auto-llenar el costo actual como sugerencia si se desea
                                        setCurrentItem({
                                            ...currentItem, 
                                            productoId: e.target.value,
                                            precio: prod ? Number(prod.costo) : 0
                                        });
                                    }}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm bg-white"
                                >
                                    <option value="">Seleccione producto...</option>
                                    {productos.map(p => (
                                        <option key={p.codProducto} value={p.codProducto}>
                                            {p.producto} (Stock: {p.existencias})
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
                            <div className="md:col-span-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Costo Unit.</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={currentItem.precio}
                                    onChange={(e) => setCurrentItem({...currentItem, precio: Number(e.target.value)})}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    onClick={handleAddItem}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium transition-colors"
                                >
                                    + Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Items */}
                    <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2 text-right">Cant.</th>
                                <th className="px-4 py-2 text-right">Precio</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                                <th className="px-4 py-2 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">
                                        No hay productos agregados
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => {
                                    const prodNombre = productos.find(p => p.codProducto === item.productoId)?.producto || item.productoId;
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-900">{prodNombre}</td>
                                            <td className="px-4 py-2 text-right">{item.cantidad}</td>
                                            <td className="px-4 py-2 text-right">C${item.precio.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right">C${(item.cantidad * item.precio).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                </div>

                {/* Footer Totals */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-right w-full md:w-auto md:ml-auto space-y-1">
                        <div className="flex justify-between md:justify-end gap-8 text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-medium">C${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between md:justify-end gap-8 text-gray-600">
                            <span>IVA (15%):</span>
                            <span className="font-medium">C${iva.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between md:justify-end gap-8 text-lg font-bold text-gray-900">
                            <span>Total:</span>
                            <span>C${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Registrar Compra"}
                    </button>
                </div>
            </div>
        </div>
    );
}