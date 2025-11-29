import type { Usuario, UsuarioFormData, UsuarioResponse } from "../types/usuario";

const API_URL = import.meta.env.VITE_API_URL+"/usuarios";

export const usuarioService = {
    getAll: async (
        page: number = 1,
        limit: number = 20,
        search: string = ""
    ): Promise<UsuarioResponse> => {
        // Construimos la URL con query params
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            params.append("search", search);
        }

        const res = await fetch(`${API_URL}?${params.toString()}`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        
        const raw = await res.json();
        
        // Si tu backend devuelve array directo en lugar de objeto {data, meta},
        // necesitamos normalizarlo, pero tu código de backend sugiere que devuelve {data, meta}
        if (Array.isArray(raw)) {
            return {
                data: raw,
                meta: { total: raw.length, page: 1, limit: raw.length, totalPages: 1, hasNext: false }
            };
        }
        
        return raw;
    },

    create: async (data: UsuarioFormData): Promise<Usuario> => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear usuario");
        return await res.json();
    },

    update: async (id: number, data: Partial<UsuarioFormData>): Promise<Usuario> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar usuario");
        return await res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar usuario");
    },
};