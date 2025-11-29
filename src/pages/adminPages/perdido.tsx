import { useState } from "react";
import { usePedidos } from "../../hooks/usePedidos";
import PedidoTable from "../../components/AdminComponets/pedidoTable";
import PedidoFormModal from "../../components/AdminComponets/pedidoFormModal";
import PedidoDetalleModal from "../../components/AdminComponets/pedidoDetalleModal";
import { AddIcon } from "../../components/icons";
import type { Pedido, PedidoCreatePayload, EstadoPedido } from "../../types/pedidos";

export default function PedidosPage() {
    const {
        pedidos,
        loading,
        error,
        search,
        setSearch,
        crearPedido,
        actualizarEstado,
        eliminarPedido
    } = usePedidos();

    const [modalOpen, setModalOpen] = useState(false);
    const [detallePedido, setDetallePedido] = useState<Pedido | null>(null);

    const handleCreate = async (data: PedidoCreatePayload) => {
        await crearPedido(data);
    };

    const handleUpdateEstado = (id: number, estado: EstadoPedido) => {
        actualizarEstado(id, estado);
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="flex-none px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center z-10 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <AddIcon /> <span className="hidden sm:inline">Nuevo Pedido</span>
                </button>
            </div>

            {/* Buscador */}
            <div className="flex-none px-4 md:px-6 mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por ID, cliente o estado..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:max-w-md border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
                        <strong className="font-bold">Error: </strong> {error}
                    </div>
                )}

                <PedidoTable
                    pedidos={pedidos}
                    loading={loading}
                    onDelete={eliminarPedido}
                    onUpdateEstado={handleUpdateEstado}
                    onVerDetalles={setDetallePedido}
                />
            </div>

            <PedidoFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreate}
            />

            <PedidoDetalleModal
                pedido={detallePedido}
                onClose={() => setDetallePedido(null)}
            />
        </div>
    );
}