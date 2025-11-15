import { useEffect, useState } from "react";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

interface Proveedor {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
}

export default function AdminProveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

    useEffect(() => {
        fetchProveedores();
    }, []);

    async function fetchProveedores() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/proveedores");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setProveedores(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar proveedores");
        } finally {
        setLoading(false);
        }
    }

    function openAddModal() {
        setEditingProveedor(null);
        setModalOpen(true);
    }

    function openEditModal(proveedor: Proveedor) {
        setEditingProveedor(proveedor);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingProveedor(null);
    }

    async function handleDelete(proveedor: Proveedor) {
        const confirm = window.confirm(`¿Eliminar proveedor ${proveedor.nombre}?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/proveedores/${proveedor.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchProveedores();
        } catch (err) {
        alert("No se pudo eliminar el proveedor");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
        nombre: formData.get("nombre"),
        telefono: formData.get("telefono"),
        email: formData.get("email"),
        };

        const isEdit = !!editingProveedor;

        try {
        const url = isEdit
            ? `http://localhost:1234/proveedores/${editingProveedor.id}`
            : "http://localhost:1234/proveedores";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar proveedor");

        await fetchProveedores();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el proveedor");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando proveedores...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {proveedores.map((prov) => (
                <tr key={prov.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{prov.id}</td>
                    <td className="px-4 py-2">{prov.nombre}</td>
                    <td className="px-4 py-2">{prov.telefono}</td>
                    <td className="px-4 py-2">{prov.email}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                    <button
                        onClick={() => openEditModal(prov)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleDelete(prov)}
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
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">
                {editingProveedor ? "Editar Proveedor" : "Agregar Proveedor"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="nombre"
                    defaultValue={editingProveedor?.nombre || ""}
                    placeholder="Nombre"
                    required
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="telefono"
                    defaultValue={editingProveedor?.telefono || ""}
                    placeholder="Teléfono (8 dígitos)"
                    required
                    pattern="\d{8}"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="email"
                    defaultValue={editingProveedor?.email || ""}
                    placeholder="Email"
                    required
                    type="email"
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
