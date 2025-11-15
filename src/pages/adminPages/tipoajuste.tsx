import { useEffect, useState } from "react";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

interface TipoAjuste {
    id: number;
    tipoAjuste: string;
}

export default function AdminTipoAjuste() {
    const [ajustes, setAjustes] = useState<TipoAjuste[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAjuste, setEditingAjuste] = useState<TipoAjuste | null>(null);

    useEffect(() => {
        fetchAjustes();
    }, []);

    async function fetchAjustes() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/tipoajustes");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setAjustes(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar tipos de ajuste");
        } finally {
        setLoading(false);
        }
    }

    function openAddModal() {
        setEditingAjuste(null);
        setModalOpen(true);
    }

    function openEditModal(ajuste: TipoAjuste) {
        setEditingAjuste(ajuste);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingAjuste(null);
    }

    async function handleDelete(ajuste: TipoAjuste) {
        const confirm = window.confirm(`¿Eliminar tipo de ajuste "${ajuste.tipoAjuste}"?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/tipoajustes/${ajuste.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchAjustes();
        } catch (err) {
        alert("No se pudo eliminar el tipo de ajuste");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
        tipoAjuste: formData.get("tipoAjuste"),
        };

        const isEdit = !!editingAjuste;

        try {
        const url = isEdit
            ? `http://localhost:1234/tipoajustes/${editingAjuste.id}`
            : "http://localhost:1234/tipoajustes";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar tipo de ajuste");

        await fetchAjustes();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el tipo de ajuste");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Tipos de Ajuste</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando tipos de ajuste...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tipo de Ajuste</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ajustes.map((ajuste) => (
                <tr key={ajuste.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{ajuste.id}</td>
                    <td className="px-4 py-2">{ajuste.tipoAjuste}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                    <button
                        onClick={() => openEditModal(ajuste)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleDelete(ajuste)}
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
                {editingAjuste ? "Editar Tipo de Ajuste" : "Agregar Tipo de Ajuste"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="tipoAjuste"
                    defaultValue={editingAjuste?.tipoAjuste || ""}
                    placeholder="Nombre del tipo de ajuste"
                    required
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
