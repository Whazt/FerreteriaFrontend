import { useEffect, useState } from "react";
import type { Product } from "../../components/listProducts";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

export default function AdminProductos() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    async function fetchProductos() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/productos");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setProducts(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar productos");
        } finally {
        setLoading(false);
        }
    }

    function openAddModal() {
        setEditingProduct(null);
        setModalOpen(true);
    }

    function openEditModal(product: Product) {
        setEditingProduct(product);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingProduct(null);
    }

    async function handleDelete(product: Product) {
        const confirm = window.confirm(`¿Eliminar ${product.producto}?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/productos/${product.codProducto}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchProductos();
        } catch (err) {
        alert("No se pudo eliminar el producto");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload: any = {
            producto: formData.get("producto"),
            descripcion: formData.get("descripcion"),
            precio: parseFloat(formData.get("precio") as string),
            costo: parseFloat(formData.get("costo") as string),
            existencias: parseInt(formData.get("existencias") as string),
            categoriaId: parseInt(formData.get("categoriaId") as string),
            imagenUrl: formData.get("imagenUrl") || null,
            existenciaMax: parseInt(formData.get("existenciaMax") as string),
            existenciaMin: parseInt(formData.get("existenciaMin") as string),
        };
        const isEdit = !!editingProduct;

        try {
        const url = isEdit
            ? `http://localhost:1234/productos/${editingProduct.codProducto}`
            : "http://localhost:1234/productos";

        if (!isEdit) {
            payload.codProducto = formData.get("codProducto");
        }

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar");

        await fetchProductos();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el producto");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de productos</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando productos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr key={product.codProducto} className="border-t border-gray-200">
                    <td className="px-4 py-2">{product.codProducto}</td>
                    <td className="px-4 py-2">{product.producto}</td>
                    <td className="px-4 py-2">{product.descripcion}</td>
                    <td className="px-4 py-2">
                    {product.precio
                        ? `$${parseFloat(product.precio).toFixed(2)}`
                        : "Precio no disponible"}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                    <button
                        onClick={() => openEditModal(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                        <TrashIcon />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        {modalOpen && (
            <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50"
            onClick={closeModal}
            >
                <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // ⬅️ Evita que el clic dentro cierre el modal
                >
                <h2 className="text-xl font-bold mb-4">
                    {editingProduct ? "Editar producto" : "Agregar producto"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editingProduct && (
                        <input
                        name="codProducto"
                        placeholder="Código"
                        required
                        className="w-full border px-3 py-2 rounded"
                        />
                    )}
                    <input
                        name="producto"
                        defaultValue={editingProduct?.producto || ""}
                        placeholder="Nombre"
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                    <textarea
                        name="descripcion"
                        defaultValue={editingProduct?.descripcion || ""}
                        placeholder="Descripción"
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="precio"
                        defaultValue={editingProduct?.precio || ""}
                        placeholder="Precio"
                        required
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="costo"
                        defaultValue={editingProduct?.costo || ""}
                        placeholder="Costo"
                        required
                        type="number"
                        step="0.01"
                        min="1"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="existencias"
                        defaultValue={editingProduct?.existencias || ""}
                        placeholder="Existencias"
                        required
                        type="number"
                        min="0"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="categoriaId"
                        defaultValue={editingProduct?.categoriaId || ""}
                        placeholder="ID de categoría"
                        required
                        type="number"
                        min="1"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="imagenUrl"
                        defaultValue={editingProduct?.imagenUrl || ""}
                        placeholder="URL de imagen (opcional)"
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="existenciaMax"
                        defaultValue={editingProduct?.existenciaMax ?? 0}
                        placeholder="Existencia máxima"
                        type="number"
                        min="0"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="existenciaMin"
                        defaultValue={editingProduct?.existenciaMin ?? 0}
                        placeholder="Existencia mínima"
                        type="number"
                        min="0"
                        className="w-full border px-3 py-2 rounded"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                        Cancelar
                        </button>
                        <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Guardar
                        </button>
                    </div>
                    </form>

                </div>
            </div>
            )}

        </section>
    );
}
