import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProduct";
import type { Product } from "../../types/product";
import ProductoTable from "../../components/AdminComponets/productTable";
import ProductoFormModal from "../../components/AdminComponets/productoFormModal";
import { AddIcon } from "../../components/icons";

export default function ProductosPage() {
    const {
        productos,
        meta,
        loading,
        fetchProductos,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
    } = useProducts();

    const [modalOpen, setModalOpen] = useState(false);
    const [productoEditando, setProductoEditando] = useState<Product | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProductos(1, 10, search);
    }, [search]);

    const handleAgregar = () => {
        setProductoEditando(null);
        setModalOpen(true);
    };

    const handleEditar = (producto: Product) => {
        setProductoEditando(producto);
        setModalOpen(true);
    };

    const handleGuardar = async (data: Omit<Product, "codProducto"> | Product) => {
        if (productoEditando) {
            console.log(productoEditando.codProducto, data)
        await actualizarProducto(productoEditando.codProducto, data);
        } else {
        await crearProducto(data as Omit<Product, "codProducto">);
        }
        setModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        fetchProductos(page, meta?.limit ?? 10, search);
    };

    return (
        <div className="flex-1 w-full min-w-0 flex flex-col">
        {/* Barra fija */}
        <div className="px-4 md:px-6 py-4 sticky top-0 bg-white z-10 flex justify-between items-center border-b border-gray-300">
            <h1 className="text-xl font-bold text-orange-400">Gestión de Productos</h1>
            <button
            onClick={handleAgregar}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {/* Buscador */}
        <div className="mt-4 mb-6 px-4 md:px-6">
            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
        </div>

        {/* Tabla con scroll horizontal */}
        <div className="flex-1 overflow-hidden">
                <ProductoTable 
                    productos={productos}
                    loading={loading}
                    onEdit={handleEditar}
                    onDelete={(p) => eliminarProducto(p.codProducto)}
                />
        </div>

        {/* Paginación */}
        {meta && (
            <div className="flex justify-center items-center gap-2 mt-6 px-4 md:px-6">
            <button
                disabled={meta.page === 1}
                onClick={() => handlePageChange(meta.page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                ← 
            </button>
            <span>
                Página {meta.page} de {meta.totalPages}
            </span>
            <button
                disabled={!meta.hasNext}
                onClick={() => handlePageChange(meta.page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                →
            </button>
            </div>
        )}

        {/* Modal */}
        <ProductoFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initialData={productoEditando}
            onSubmit={handleGuardar}
        />
        </div>
    );
}
