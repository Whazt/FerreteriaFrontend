import { useEffect, useState } from "react";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

interface Usuario {
    id: number;
    email: string;
    contrasenaHash: string;
    rolId: number;
}

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    async function fetchUsuarios() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/usuarios");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setUsuarios(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar usuarios");
        } finally {
        setLoading(false);
        }
    }

    function openAddModal() {
        setEditingUsuario(null);
        setModalOpen(true);
    }

    function openEditModal(usuario: Usuario) {
        setEditingUsuario(usuario);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingUsuario(null);
    }

    async function handleDelete(usuario: Usuario) {
        const confirm = window.confirm(`¿Eliminar usuario ${usuario.email}?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/usuarios/${usuario.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchUsuarios();
        } catch (err) {
        alert("No se pudo eliminar el usuario");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload: any = {
        email: formData.get("email"),
        password: formData.get("contrasenaHash"),
        rolId: parseInt(formData.get("rolId") as string),
        };

        const isEdit = !!editingUsuario;

        try {
        const url = isEdit
            ? `http://localhost:1234/usuarios/${editingUsuario.id}`
            : "http://localhost:1234/usuarios";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar");

        await fetchUsuarios();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el usuario");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de usuarios</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando usuarios...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{usuario.id}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{usuario.rolId}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                    <button
                        onClick={() => openEditModal(usuario)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleDelete(usuario)}
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
                {editingUsuario ? "Editar usuario" : "Agregar usuario"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    defaultValue={editingUsuario?.email || ""}
                    placeholder="Email"
                    required
                    type="email"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="contrasenaHash"
                    placeholder="Contraseña"
                    required={!editingUsuario}
                    type="password"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="rolId"
                    defaultValue={editingUsuario?.rolId || ""}
                    placeholder="Rol ID"
                    required
                    type="number"
                    min="1"
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
