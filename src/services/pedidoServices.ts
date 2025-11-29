import type { Pedido, PedidoCreatePayload, EstadoPedido } from "../types/pedidos";

const API_URL = import.meta.env.VITE_API_URL+"/pedidos"; 

export const pedidoService = {
    getAll: async (): Promise<Pedido[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener pedidos");
        const raw = await res.json();
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    getById: async (id: number): Promise<Pedido> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Error al obtener el pedido");
        return await res.json();
    },

    getByClient: async (clienteId: number): Promise<Pedido[]> => {
        const res = await fetch(`${API_URL}/cliente/${clienteId}`);
        if (!res.ok) throw new Error("Error al obtener pedidos del cliente");
        return await res.json();
    },

    // El backend espera en el body: { usuarioId, data: { ...detallesPedido } }
    create: async (payload: PedidoCreatePayload): Promise<Pedido> => {
        // Separamos el usuarioId del resto de los datos del pedido
        const { usuarioId, ...pedidoData } = payload;
        
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                usuarioId: usuarioId, 
                data: pedidoData // Envolvemos el resto en 'data' como pide tu controller
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Error al crear pedido"); // Tu backend devuelve { error: message }
        }
        return await res.json();
    },

    updateEstado: async (id: number, estado: EstadoPedido): Promise<Pedido> => {
        // Tu ruta backend es: router.put('/:id/estado', ...)
        const res = await fetch(`${API_URL}/${id}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado }), 
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Error al actualizar estado");
        }
        return await res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Error al eliminar pedido");
        }
    },
};