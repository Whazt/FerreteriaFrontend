import type { Categoria, CategoriaFormData } from "../types/categoria";

const API_URL = import.meta.env.VITE_API_URL+"/categorias"; 

export const categoriaService = {
    getAll: async (): Promise<Categoria[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener categorías");
        
        const raw = await res.json();
        // Soporte por si el backend devuelve un array directo o un objeto { data: [...] }
        return Array.isArray(raw) ? raw : raw.data || [];
    },

    create: async (data: CategoriaFormData): Promise<Categoria> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear categoría");
        return await res.json();
    },

    update: async (id: number, data: CategoriaFormData): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar categoría");
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar categoría");
    },
};