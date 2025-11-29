import type { TipoAjuste, TipoAjusteFormData } from "../types/tipoAjuste";

// Ajusta el puerto si es necesario, en tus ejemplos anteriores usabas 1234
const API_URL = import.meta.env.VITE_API_URL+"/tipoajustes"; 

export const tipoAjusteService = {
    getAll: async (): Promise<TipoAjuste[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener tipos de ajuste");
        return await res.json();
    },

    create: async (data: TipoAjusteFormData): Promise<TipoAjuste> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear tipo de ajuste");
        return await res.json();
    },

    update: async (id: number, data: TipoAjusteFormData): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar tipo de ajuste");
        // El backend devuelve el resultado del update de sequelize, no siempre el objeto
        return await res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar tipo de ajuste");
    },
};