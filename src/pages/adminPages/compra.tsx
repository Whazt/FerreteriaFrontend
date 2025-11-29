import { useState } from "react";
import { useCompras } from "../../hooks/useCompras";
import CompraTable from "../../components/AdminComponets/compraTable";
import CompraFormModal from "../../components/AdminComponets/compraFormModal";
import CompraDetalleModal from "../../components/AdminComponets/detalleCompraModal";
import { AddIcon } from "../../components/icons";
import type { Compra, CompraCreatePayload } from "../../types/compra";

export default function ComprasPage() {
    const {
        compras,
        loading,
        crearCompra,
        aplicarCompra,
        eliminarCompra
    } = useCompras();

    const [modalOpen, setModalOpen] = useState(false);
    const [detalleCompra, setDetalleCompra] = useState<Compra | null>(null);

    const handleCreate = async (data: CompraCreatePayload) => {
        await crearCompra(data);
        // Modal se cierra dentro del componente si éxito
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
            <div className="flex-none px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center z-10 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestión de Compras</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <AddIcon /> <span className="hidden sm:inline">Nueva Compra</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
                <CompraTable
                    compras={compras}
                    loading={loading}
                    onDelete={eliminarCompra}
                    onAplicar={aplicarCompra}
                    onVerDetalles={setDetalleCompra}
                />
            </div>

            <CompraFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreate}
            />

            <CompraDetalleModal
                compra={detalleCompra}
                onClose={() => setDetalleCompra(null)}
            />
        </div>
    );
}