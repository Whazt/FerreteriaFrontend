import type { Proveedor, ProveedorFormData } from "../types/proveedor";

const API_URL = "http://localhost:1234/proveedores"; 

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener proveedores");
        const raw = await res.json();
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    create: async (data: ProveedorFormData): Promise<Proveedor> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear proveedor");
        return await res.json();
    },

    update: async (id: number, data: ProveedorFormData): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar proveedor");
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar proveedor");
    },
};