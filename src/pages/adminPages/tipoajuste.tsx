import { useState } from "react";
import { useTipoAjuste } from "../../hooks/useTipoAjustes";
import TipoAjusteTable from "../../components/AdminComponets/tipoAjusteTable";
import TipoAjusteFormModal from "../../components/AdminComponets/tipoAjusteFormModal";
import { AddIcon } from "../../components/icons";
import type { TipoAjuste, TipoAjusteFormData } from "../../types/tipoAjuste";

export default function TipoAjustePage() {
    const {
        tipos,
        loading,
        error,
        search,
        setSearch,
        crearTipo,
        actualizarTipo,
        eliminarTipo
    } = useTipoAjuste();

    const [modalOpen, setModalOpen] = useState(false);
    const [registroEditando, setRegistroEditando] = useState<TipoAjuste | null>(null);

    const handleAgregar = () => {
        setRegistroEditando(null);
        setModalOpen(true);
    };

    const handleEditar = (item: TipoAjuste) => {
        setRegistroEditando(item);
        setModalOpen(true);
    };

    const handleGuardar = async (data: TipoAjusteFormData) => {
        if (registroEditando) {
            await actualizarTipo(registroEditando.id, data);
        } else {
            await crearTipo(data);
        }
        // El modal se cierra tras la confirmación exitosa en el onSubmit del componente modal
        // o podemos forzarlo a false aquí si queremos.
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
            {/* Header Fijo */}
            <div className="flex-none px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center z-10">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tipos de Ajuste</h1>
                <button
                    onClick={handleAgregar}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <AddIcon /> <span className="hidden sm:inline">Agregar</span>
                </button>
            </div>

            {/* Buscador */}
            <div className="flex-none px-4 md:px-6 mt-4 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar tipo de ajuste..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:max-w-md border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 md:right-auto md:left-104 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Área de Contenido con Scroll */}
            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <TipoAjusteTable
                    tipos={tipos}
                    loading={loading}
                    onEdit={handleEditar}
                    onDelete={eliminarTipo}
                />
            </div>

            {/* Modal */}
            <TipoAjusteFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={registroEditando}
                onSubmit={handleGuardar}
            />
        </div>
    );
}