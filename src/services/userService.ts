import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    });

    async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
    }

    export const userService = {
    // 🔹 Listar usuarios (solo admins)
    async getAll(token: string, params?: { page?: number; limit?: number }): Promise<{
        data: User[];
        meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        };
        mensaje?: string;
    }> {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.limit) query.append("limit", String(params.limit));

        const res = await fetch(`${API_URL}/usuarios?${query.toString()}`, {
        headers: authHeader(token),
        });
        return handle(res);
    },

    // 🔹 Obtener usuario por ID (incluye cliente si existe)
    async getById(token: string, id: number): Promise<User> {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
        headers: authHeader(token),
        });
        return handle<User>(res);
    },

    // 🔹 Crear usuario
    async create(token: string, data: { email: string; password: string; rolId: number }): Promise<User> {
        const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(data),
        });
        return handle<User>(res);
    },

    // 🔹 Actualizar usuario
    async update(token: string, id: number, data: Partial<{ email: string; password: string; rolId: number }>): Promise<User> {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify(data),
        });
        return handle<User>(res);
    },

    // 🔹 Eliminar usuario
    async delete(token: string, id: number): Promise<{ ok: true }> {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: authHeader(token),
        });
        return handle<{ ok: true }>(res);
    },
};
