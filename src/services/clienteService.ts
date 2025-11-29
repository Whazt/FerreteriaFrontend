import type { Cliente, ClienteFormData } from "../types/cliente";

const API_URL = import.meta.env.VITE_API_URL+"/clientes"; 

export const clienteService = {
    getAll: async (): Promise<Cliente[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener clientes");
        const raw = await res.json();
        // Soporte si el backend devuelve array directo o { data: [...] }
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    create: async (data: ClienteFormData): Promise<Cliente> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear cliente");
        return await res.json();
    },

    update: async (id: number, data: ClienteFormData): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar cliente");
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar cliente");
    },
};