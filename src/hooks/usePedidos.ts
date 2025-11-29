import { useState, useEffect, useMemo } from "react";
import type { Pedido, PedidoCreatePayload, EstadoPedido } from "../types/pedidos";
import { pedidoService } from "../services/pedidoServices";

export function usePedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await pedidoService.getAll();
            // Ordenar por ID descendente (más recientes primero)
            setPedidos(data.sort((a, b) => b.id - a.id));
        } catch (err: any) {
            setError(err.message || "Error al cargar pedidos");
        } finally {
            setLoading(false);
        }
    };

    const crearPedido = async (data: PedidoCreatePayload) => {
        await pedidoService.create(data);
        fetchPedidos(); 
    };

    const actualizarEstado = async (id: number, estado: EstadoPedido) => {
        try {
            await pedidoService.updateEstado(id, estado);
            fetchPedidos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const eliminarPedido = async (id: number) => {
        try {
            await pedidoService.delete(id);
            fetchPedidos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Filtrado local
    const pedidosFiltrados = useMemo(() => {
        if (!search) return pedidos;
        const lowerSearch = search.toLowerCase();
        return pedidos.filter((p) => 
            p.id.toString().includes(lowerSearch) ||
            p.cliente?.nombres.toLowerCase().includes(lowerSearch) ||
            p.cliente?.apellidos.toLowerCase().includes(lowerSearch) ||
            p.estado.toLowerCase().includes(lowerSearch)
        );
    }, [pedidos, search]);

    useEffect(() => {
        fetchPedidos();
    }, []);

    return {
        pedidos: pedidosFiltrados,
        loading,
        error,
        search,
        setSearch,
        fetchPedidos,
        crearPedido,
        actualizarEstado,
        eliminarPedido,
    };
}