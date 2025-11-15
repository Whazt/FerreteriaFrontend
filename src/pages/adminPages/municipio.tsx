import { useEffect, useState } from "react";
import { TrashIcon, EditIcon, AddIcon } from "../../components/icons";

interface Municipio {
    id: number;
    municipio: string;
    departamentoId: number;
}

interface Departamento {
    id: number;
    departamento: string;
}

export default function AdminMunicipios() {
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null);

    useEffect(() => {
        fetchMunicipios();
        fetchDepartamentos();
    }, []);

    async function fetchMunicipios() {
        try {
        setLoading(true);
        const res = await fetch("http://localhost:1234/municipio");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setMunicipios(data);
        setError(null);
        } catch (err: any) {
        setError("Error al cargar municipios");
        } finally {
        setLoading(false);
        }
    }

    async function fetchDepartamentos() {
        try {
        const res = await fetch("http://localhost:1234/departamento");
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;
        setDepartamentos(data);
        } catch (err) {
        console.error("Error al cargar departamentos");
        }
    }

    function openAddModal() {
        setEditingMunicipio(null);
        setModalOpen(true);
    }

    function openEditModal(mun: Municipio) {
        setEditingMunicipio(mun);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingMunicipio(null);
    }

    async function handleDelete(mun: Municipio) {
        const confirm = window.confirm(`¿Eliminar municipio "${mun.municipio}"?`);
        if (!confirm) return;

        try {
        const res = await fetch(`http://localhost:1234/municipio/${mun.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await fetchMunicipios();
        } catch (err) {
        alert("No se pudo eliminar el municipio");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
        municipio: formData.get("municipio"),
        departamentoId: parseInt(formData.get("departamentoId") as string),
        };

        const isEdit = !!editingMunicipio;

        try {
        const url = isEdit
            ? `http://localhost:1234/municipio/${editingMunicipio.id}`
            : "http://localhost:1234/municipio";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al guardar municipio");

        await fetchMunicipios();
        closeModal();
        } catch (err) {
        alert("No se pudo guardar el municipio");
        }
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Municipios</h1>
            <button
            onClick={openAddModal}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
            <AddIcon /> Agregar
            </button>
        </div>

        {loading && <p className="text-gray-500">Cargando municipios...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <table className="w-full table-auto border border-gray-300 shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Municipio</th>
                <th className="px-4 py-2 text-left">Departamento</th>
                <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {municipios.map((mun) => {
                const dep = departamentos.find((d) => d.id === mun.departamentoId);
                return (
                    <tr key={mun.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{mun.id}</td>
                    <td className="px-4 py-2">{mun.municipio}</td>
                    <td className="px-4 py-2">{dep ? dep.departamento : mun.departamentoId}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                        <button
                        onClick={() => openEditModal(mun)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                        >
                        <EditIcon />
                        </button>
                        <button
                        onClick={() => handleDelete(mun)}
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
                {editingMunicipio ? "Editar Municipio" : "Agregar Municipio"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="municipio"
                    defaultValue={editingMunicipio?.municipio || ""}
                    placeholder="Nombre del municipio"
                    required
                    className="w-full border px-3 py-2 rounded"
                />

                <select
                    name="departamentoId"
                    defaultValue={editingMunicipio?.departamentoId || ""}
                    required
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                        {dep.departamento}
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
