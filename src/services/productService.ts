import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
    // Obtener catálogo completo o paginado
    async getCatalogo(page: number = 1, limit: number = 20): Promise<Product[]> {
        const res = await fetch(`${API_URL}/productos?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Error al obtener catálogo de productos");

        const json = await res.json();
        return (json.data ?? []).map((p: any) => ({
            codProducto: p.codProducto,
            producto: p.producto,
            descripcion: p.descripcion,
            precio: parseFloat(p.precio),   
            existencias: p.existencias,
            imagenUrl: p.imagenUrl ?? null,
            categoria: p.categoria ?? null,
        }));
    },


    // Obtener un producto por ID
    async getById(id: string): Promise<Product> {
        const res = await fetch(`${API_URL}/productos/${id}`);
        if (!res.ok) throw new Error("Error al obtener producto");
        return await res.json();
    },

    // Crear un producto nuevo
    async create(producto: Omit<Product, "codProducto">): Promise<Product> {
        const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
        });
        if (!res.ok) throw new Error("Error al crear producto");
        return await res.json();
    },

    // Actualizar producto existente
    async update(id: string, producto: Partial<Product>): Promise<Product> {
        const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
        });
        if (!res.ok) throw new Error("Error al actualizar producto");
        return await res.json();
    },

    // Eliminar producto
    async delete(id: string): Promise<{ ok: true }> {
        const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar producto");
        return await res.json();
    },
};
