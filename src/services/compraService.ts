import type { Compra, CompraCreatePayload } from "../types/compra";

const API_URL = import.meta.env.VITE_API_URL+"/compras"; 

export const compraService = {
    getAll: async (): Promise<Compra[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener compras");
        const raw = await res.json();
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    getById: async (id: number): Promise<Compra> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Error al obtener la compra");
        return await res.json();
    },

    create: async (data: CompraCreatePayload): Promise<Compra> => {
        // Tu backend espera: create(proveedorId, data)
        // Probablemente el endpoint sea POST /compras con body { proveedorId, data: items }
        // Ojo: Ajusta esto según cómo recibas el body en tu controller de Express
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                proveedorId: data.proveedorId,
                data: data.items // Tu backend espera 'data' como el array de items
            }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al registrar compra");
        }
        return await res.json();
    },

    aplicar: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}/aplicar`, { // Ajusta la ruta según tu router
            method: "POST", // Usualmente es un POST o PUT para acciones
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al aplicar compra");
        }
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al eliminar compra");
        }
    },
};