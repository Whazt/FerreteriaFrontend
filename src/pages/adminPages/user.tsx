import { useState, useEffect } from "react";
import { useUsuarios } from "../../hooks/useUsuario";
import type { Usuario, UsuarioFormData } from "../../types/usuario";
import UsuarioTable from "../../components/AdminComponets/usuarioTable";
import UsuarioFormModal from "../../components/AdminComponets/usuarioFormModal";
import { AddIcon } from "../../components/icons";

export default function UsuariosPage() {
    const {
        usuarios,
        meta,
        loading,
        fetchUsuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
    } = useUsuarios();

    const [modalOpen, setModalOpen] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
    const [search, setSearch] = useState("");

    // Efecto para buscar y paginar cuando cambia 'search' (o al montar)
    // Reiniciamos a página 1 cuando cambia la búsqueda
    useEffect(() => {
        fetchUsuarios(1, 10, search);
    }, [search]);

    const handleAgregar = () => {
        setUsuarioEditando(null);
        setModalOpen(true);
    };

    const handleEditar = (usuario: Usuario) => {
        setUsuarioEditando(usuario);
        setModalOpen(true);
    };

    const handleGuardar = async (data: UsuarioFormData) => {
        if (usuarioEditando) {
            await actualizarUsuario(usuarioEditando.id, data);
        } else {
            await crearUsuario(data);
        }
        // Nota: Dependiendo de tu lógica, podrías querer cerrar el modal aqui 
        // o esperar a que la promesa del hook resuelva (el hook actual no devuelve promesa en create/update
        // pero podrías modificarlo. Por ahora asumimos éxito optimista o recarga).
        setModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        fetchUsuarios(page, meta?.limit ?? 10, search);
    };

    return (
        <div className="flex-1 w-full min-w-0 flex flex-col h-full bg-gray-50">
            {/* Barra fija */}
            <div className="px-4 md:px-6 py-4 sticky top-0 bg-white z-10 flex justify-between items-center border-b border-gray-300 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button
                    onClick={handleAgregar}
                    className="flex gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <AddIcon /> <span className="hidden sm:inline">Agregar</span>
                </button>
            </div>

            {/* Buscador */}
            {/* <div className="mt-4 mb-6 px-4 md:px-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar usuario por email..."
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div> */}

            {/* Tabla con scroll contenido */}
            <div className="flex-1 overflow-hidden px-4 mt-2 md:px-6 pb-4">
                <UsuarioTable
                    usuarios={usuarios}
                    loading={loading}
                    onEdit={handleEditar}
                    onDelete={eliminarUsuario}
                />
            </div>

            {/* Paginación */}
            {meta && (
                <div className="flex-none py-4 border-t border-gray-200 bg-white z-10">
                    <div className="flex justify-center items-center gap-4">
                        <button
                            disabled={meta.page === 1}
                            onClick={() => handlePageChange(meta.page - 1)}
                            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            Página {meta.page} de {meta.totalPages}
                        </span>
                        <button
                            disabled={!meta.hasNext}
                            onClick={() => handlePageChange(meta.page + 1)}
                            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <UsuarioFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={usuarioEditando}
                onSubmit={handleGuardar}
            />
        </div>
    );
}