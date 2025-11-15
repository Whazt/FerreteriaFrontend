import { useEffect, useState } from "react";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

interface Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    usuarioId: number;
}

interface Usuario {
    id: number;
    email: string;
}

export default function AdminClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        fetchClientes();
        fetchUsuarios();
    }, []);

    async function fetchClientes() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/clientes");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setClientes(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar clientes");
        } finally {
        setLoading(false);
        }
    }

    async function fetchUsuarios() {
        try {
        const res = await fetch("http://localhost:1234/usuarios");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setUsuarios(data);
        } catch (err) {
        console.error("Error al cargar usuarios");
        }
    }

    function openAddModal() {
        setEditingCliente(null);
        setModalOpen(true);
    }

    function openEditModal(cliente: Cliente) {
        setEditingCliente(cliente);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingCliente(null);
    }

    async function handleDelete(cliente: Cliente) {
        const confirm = window.confirm(`¿Eliminar cliente ${cliente.nombres} ${cliente.apellidos}?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/clientes/${cliente.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchClientes();
        } catch (err) {
        alert("No se pudo eliminar el cliente");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
        nombres: formData.get("nombres"),
        apellidos: formData.get("apellidos"),
        telefono: formData.get("telefono"),
        usuarioId: parseInt(formData.get("usuarioId") as string),
        };

        const isEdit = !!editingCliente;

        try {
        const url = isEdit
            ? `http://localhost:1234/clientes/${editingCliente.id}`
            : "http://localhost:1234/clientes";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar cliente");

        await fetchClientes();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el cliente");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando clientes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombres</th>
                <th className="px-4 py-2 text-left">Apellidos</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">Usuario</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {clientes.map((cli) => {
                const usuario = usuarios.find((u) => u.id === cli.usuarioId);
                return (
                    <tr key={cli.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{cli.id}</td>
                    <td className="px-4 py-2">{cli.nombres}</td>
                    <td className="px-4 py-2">{cli.apellidos}</td>
                    <td className="px-4 py-2">{cli.telefono}</td>
                    <td className="px-4 py-2">{usuario ? usuario.email : cli.usuarioId}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                        <button
                        onClick={() => openEditModal(cli)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                        >
                        <EditIcon />
                        </button>
                        <button
                        onClick={() => handleDelete(cli)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                        <TrashIcon />
                        </button>
                    </td>
                    </tr>
                );
                })}
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
                {editingCliente ? "Editar Cliente" : "Agregar Cliente"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="nombres"
                    defaultValue={editingCliente?.nombres || ""}
                    placeholder="Nombres"
                    required
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="apellidos"
                    defaultValue={editingCliente?.apellidos || ""}
                    placeholder="Apellidos"
                    required
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="telefono"
                    defaultValue={editingCliente?.telefono || ""}
                    placeholder="Teléfono (8 dígitos)"
                    required
                    pattern="\d{8}"
                    className="w-full border px-3 py-2 rounded"
                />
                <select
                    name="usuarioId"
                    defaultValue={editingCliente?.usuarioId || ""}
                    required
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.email}
                    </option>
                    ))}
                </select>

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
