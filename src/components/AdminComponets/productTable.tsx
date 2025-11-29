import { useState } from "react";
import type { Product } from "../../types/product";
import { EditIcon, TrashIcon } from "../icons";

type Props = {
    productos: Product[];
    loading?: boolean;
    onEdit: (producto: Product) => void;
    onDelete: (producto: Product) => void;
};

export default function ProductoTable({ productos, loading, onEdit, onDelete }: Props) {
    // Estado para controlar qué producto se está intentando eliminar
    // Si es null, el modal está cerrado. Si tiene un producto, el modal está abierto.
    const [productoAEliminar, setProductoAEliminar] = useState<Product | null>(null);

    const confirmarEliminacion = () => {
        if (productoAEliminar) {
            onDelete(productoAEliminar);
            setProductoAEliminar(null); // Cerrar modal
        }
    };

    const cancelarEliminacion = () => {
        setProductoAEliminar(null); // Cerrar modal sin borrar
    };

    if (loading)
        return <div className="p-4 text-center text-gray-500">Cargando productos...</div>;

    if (productos.length === 0)
        return <div className="p-4 text-center text-gray-500">No hay productos registrados.</div>;

    return (
        <div className="w-full relative">
            {/* ==========================================
                VISTA MÓVIL (< 768px) - Muestra Tarjetas
               ========================================== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {productos.map((product, index) => (
                    <div
                        key={product.codProducto || index}
                        className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Código</span>
                                <p className="text-gray-900 font-medium">#{product.codProducto}</p>
                            </div>
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {product.precio !== undefined && product.precio !== null
                                    ? `C$${Number(product.precio).toFixed(2)}`
                                    : "N/A"}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Producto</span>
                            <p className="text-gray-900 font-semibold text-lg">{product.producto}</p>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Descripción</span>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {product.descripcion || "Sin descripción"}
                            </p>
                        </div>

                        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => onEdit(product)}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-md font-medium hover:bg-yellow-600 active:scale-95 transition-all"
                            >
                                <EditIcon /> Editar
                            </button>
                            <button
                                // CAMBIO: En lugar de onDelete directo, abrimos el modal
                                onClick={() => setProductoAEliminar(product)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 active:scale-95 transition-all"
                            >
                                <TrashIcon /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==========================================
                VISTA DESKTOP (>= 768px) - Muestra Tabla
               ========================================== */}
            <div className="hidden md:block w-full px-6">
                <div className="overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">Código</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Nombre</th>
                                    <th className="px-6 py-4">Descripción</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Precio</th>
                                    <th className="px-6 py-4 text-center whitespace-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productos.map((product, index) => (
                                    <tr
                                        key={product.codProducto || index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {product.codProducto}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">
                                            {product.producto}
                                        </td>
                                        <td
                                            className="px-6 py-4 max-w-xs truncate"
                                            title={product.descripcion}
                                        >
                                            {product.descripcion}
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-bold whitespace-nowrap">
                                            {product.precio !== undefined && product.precio !== null
                                                ? `C$${Number(product.precio).toFixed(2)}`
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                                                    title="Editar"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    // CAMBIO: En lugar de onDelete directo, abrimos el modal
                                                    onClick={() => setProductoAEliminar(product)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ==========================================
                MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
               ========================================== */}
            {productoAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        
                        {/* Cabecera del Modal con Icono de Advertencia */}
                        <div className="p-6 pb-0 flex flex-col items-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center">¿Eliminar producto?</h3>
                            <p className="mt-2 text-sm text-gray-500 text-center">
                                Estás a punto de eliminar <strong>"{productoAEliminar.producto}"</strong>. 
                                <br />
                                Esta acción no se puede deshacer.
                            </p>
                        </div>

                        {/* Botones de Acción */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 mt-6">
                            <button
                                type="button"
                                onClick={confirmarEliminacion}
                                className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm transition-colors"
                            >
                                Sí, eliminar
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEliminacion}
                                className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}