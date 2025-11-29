import type { Ajuste, AjusteCreatePayload } from "../types/ajuste";

const API_URL = import.meta.env.VITE_API_URL+"/ajustes"; 

export const ajusteService = {
    getAll: async (): Promise<Ajuste[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener ajustes");
        const raw = await res.json();
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    getByProducto: async (productoId: string): Promise<Ajuste[]> => {
        const res = await fetch(`${API_URL}/producto/${productoId}`);
        if (!res.ok) throw new Error("Error al obtener ajustes del producto");
        return await res.json();
    },

    create: async (data: AjusteCreatePayload): Promise<Ajuste> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al registrar ajuste");
        }
        return await res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al eliminar ajuste");
        }
    },
};