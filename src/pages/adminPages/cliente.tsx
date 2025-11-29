import { useState } from "react";
import { useClientes } from "../../hooks/useCliente";
import ClienteTable from "../../components/AdminComponets/clienteTable";
import ClienteFormModal from "../../components/AdminComponets/clienteFormModal";
import { AddIcon } from "../../components/icons";
import type { Cliente, ClienteFormData } from "../../types/cliente";

export default function ClientesPage() {
    const {
        clientes,
        loading,
        error,
        search,
        setSearch,
        crearCliente,
        actualizarCliente,
        eliminarCliente
    } = useClientes();

    const [modalOpen, setModalOpen] = useState(false);
    const [registroEditando, setRegistroEditando] = useState<Cliente | null>(null);

    const handleAgregar = () => {
        setRegistroEditando(null);
        setModalOpen(true);
    };

    const handleEditar = (item: Cliente) => {
        setRegistroEditando(item);
        setModalOpen(true);
    };

    const handleGuardar = async (data: ClienteFormData) => {
        if (registroEditando) {
            await actualizarCliente(registroEditando.id, data);
        } else {
            await crearCliente(data);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
            {/* Header Fijo */}
            <div className="flex-none px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center z-10 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
                <button
                    onClick={handleAgregar}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95 transform"
                >
                    <AddIcon /> <span className="hidden sm:inline">Agregar</span>
                </button>
            </div>

            {/* Buscador */}
            <div className="flex-none px-4 md:px-6 mt-4 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o teléfono..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:max-w-md border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 md:right-auto md:left-104 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Área de Contenido */}
            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
                        <strong className="font-bold">Error: </strong> {error}
                    </div>
                )}

                <ClienteTable
                    clientes={clientes}
                    loading={loading}
                    onEdit={handleEditar}
                    onDelete={eliminarCliente}
                />
            </div>

            {/* Modal */}
            <ClienteFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={registroEditando}
                onSubmit={handleGuardar}
            />
        </div>
    );
}