import { useState, useEffect, useMemo } from "react";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import { categoriaService } from "../services/categoriaService";

export function useCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Función para cargar datos desde el backend
    const fetchCategorias = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoriaService.getAll();
            setCategorias(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    const crearCategoria = async (data: CategoriaFormData) => {
        await categoriaService.create(data);
        fetchCategorias(); // Recargar la lista para mostrar lo nuevo
    };

    const actualizarCategoria = async (id: number, data: CategoriaFormData) => {
        await categoriaService.update(id, data);
        fetchCategorias(); // Recargar la lista para mostrar cambios
    };

    const eliminarCategoria = async (id: number) => {
        await categoriaService.delete(id);
        fetchCategorias(); // Recargar la lista
    };

    // Lógica de filtrado en el cliente (Frontend)
    const categoriasFiltradas = useMemo(() => {
        if (!search) return categorias;
        const lowerSearch = search.toLowerCase();
        
        return categorias.filter((c) => 
            // Buscamos por el nombre de la categoría O la descripción
            c.categoria.toLowerCase().includes(lowerSearch) ||
            (c.descripcion && c.descripcion.toLowerCase().includes(lowerSearch)) ||
            c.id.toString().includes(lowerSearch)
        );
    }, [categorias, search]);

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchCategorias();
    }, []);

    return {
        categorias: categoriasFiltradas,
        loading,
        error,
        search,
        setSearch,
        fetchCategorias,
        crearCategoria,
        actualizarCategoria,
        eliminarCategoria,
    };
}