import { useState, useEffect } from "react";
import type { Product, Meta } from "../types/product";
import { productService } from "../services/productService";

export function useProducts() {
    const [productos, setProductos] = useState<Product[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProductos = async (
        page: number = 1,
        limit: number = 20,
        search?: string,
        categoriaId?: string,
        precioMin?: number,
        precioMax?: number
    ) => {
        setLoading(true);
        setError(null);
        try {
        const { data, meta } = await productService.getCatalogo(
            page,
            limit,
            search,
            categoriaId,
            precioMin,
            precioMax
        );
        // Los datos ya vienen normalizados desde el service
        setProductos(data);
        setMeta(meta);
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    const crearProducto = async (p: Omit<Product, "codProducto">) => {
        const nuevo = await productService.create(p);
        // Normalizar aquí también
        setProductos((prev) => [...prev, {
        ...nuevo,
        precio: nuevo.precio !== undefined && nuevo.precio !== null ? Number(nuevo.precio) : 0,
        existencias: nuevo.existencias !== undefined && nuevo.existencias !== null ? Number(nuevo.existencias) : 0,
        costo: nuevo.costo !== undefined && nuevo.costo !== null ? Number(nuevo.costo) : 0,
        existenciaMax: nuevo.existenciaMax !== undefined && nuevo.existenciaMax !== null ? Number(nuevo.existenciaMax) : 0,
        existenciaMin: nuevo.existenciaMin !== undefined && nuevo.existenciaMin !== null ? Number(nuevo.existenciaMin) : 0,
        }]);
    };

    const actualizarProducto = async (id: string, p: Partial<Product>) => {
        await productService.update(id, p);
        // 🔄 recarga el catálogo completo para mantener consistencia
        await fetchProductos();
    };


    const eliminarProducto = async (id: string) => {
        await productService.delete(id);
        setProductos((prev) => prev.filter((prod) => prod.codProducto !== id));
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return {
        productos,
        meta,
        loading,
        error,
        fetchProductos,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
    };
}
