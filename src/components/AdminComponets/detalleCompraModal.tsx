import { useEffect } from "react";
import type { Compra } from "../../types/compra";
import { useProducts } from "../../hooks/useProduct";
import { useProveedores } from "../../hooks/useProveedor"; // Importamos el hook de proveedores

type Props = {
    compra: Compra | null;
    onClose: () => void;
};

export default function CompraDetalleModal({ compra, onClose }: Props) {
    const { productos } = useProducts();
    // Necesitamos la lista de proveedores para buscar el nombre por ID
    // ya que a veces el backend de compras no incluye el objeto 'proveedor' completo
    const { proveedores, fetchProveedores } = useProveedores();

    useEffect(() => {
        if (compra && proveedores.length === 0) {
            fetchProveedores();
        }
    }, [compra]);

    if (!compra) return null;

    const total = Number(compra.subtotal) + Number(compra.iva);

    // Búsqueda robusta del nombre del proveedor
    // 1. Intenta leer del objeto anidado compra.proveedor
    // 2. Si no existe, busca en la lista cargada por useProveedores usando compra.proveedorId
    // 3. Si falla, muestra el ID como fallback
    const nombreProveedor = compra.proveedor?.nombre 
        || proveedores.find(p => p.id === compra.proveedorId)?.nombre 
        || "Cargando ID: " + compra.proveedorId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Detalles de Compra #{compra.id}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${compra.estado === 'aplicada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {compra.estado.toUpperCase()}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <span className="block text-gray-500">Proveedor</span>
                            <span className="font-medium text-gray-900">{nombreProveedor}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Fecha Registro</span>
                            <span className="font-medium text-gray-900">{new Date(compra.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2 text-right">Cant.</th>
                                <th className="px-4 py-2 text-right">Precio</th>
                                <th className="px-4 py-2 text-right">IVA</th>
                                <th className="px-4 py-2 text-right">Total Línea</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compra.detalles?.map((detalle) => {
                                // Buscar nombre si no viene en el detalle
                                const nombreProd = productos.find(p => p.codProducto === detalle.productoId)?.producto || detalle.productoId;
                                const totalLinea = (Number(detalle.cantidad) * Number(detalle.precioCompra)) + Number(detalle.iva);
                                
                                return (
                                    <tr key={detalle.id} className="border-b">
                                        <td className="px-4 py-2">{nombreProd}</td>
                                        <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                                        <td className="px-4 py-2 text-right">C${Number(detalle.precioCompra).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right">C${Number(detalle.iva).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right font-medium">C${totalLinea.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right space-y-1">
                        <div className="text-sm text-gray-600">Subtotal: C${Number(compra.subtotal).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">IVA: C${Number(compra.iva).toFixed(2)}</div>
                        <div className="text-lg font-bold text-gray-900">Total: C${total.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}