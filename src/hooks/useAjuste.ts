import { useState, useEffect, useMemo } from "react";
import type { Ajuste, AjusteCreatePayload } from "../types/ajuste";
import { ajusteService } from "../services/ajusteService";

export function useAjustes() {
    const [ajustes, setAjustes] = useState<Ajuste[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchAjustes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ajusteService.getAll();
            // Ordenar por ID descendente (más recientes primero)
            setAjustes(data.sort((a, b) => b.id - a.id));
        } catch (err: any) {
            setError(err.message || "Error al cargar ajustes");
        } finally {
            setLoading(false);
        }
    };

    const crearAjuste = async (data: AjusteCreatePayload) => {
        await ajusteService.create(data);
        fetchAjustes(); // Recargar para ver el nuevo ajuste y actualización de stock
    };

    const eliminarAjuste = async (id: number) => {
        try {
            await ajusteService.delete(id);
            fetchAjustes();
        } catch (err: any) {
            alert(err.message); // Mostrar error si falla la reversión (ej: stock negativo)
        }
    };

    // Filtrado local
    const ajustesFiltrados = useMemo(() => {
        if (!search) return ajustes;
        const lowerSearch = search.toLowerCase();
        return ajustes.filter((a) => 
            a.producto?.producto.toLowerCase().includes(lowerSearch) ||
            a.tipoAjuste?.tipoAjuste.toLowerCase().includes(lowerSearch) ||
            a.observacion.toLowerCase().includes(lowerSearch)
        );
    }, [ajustes, search]);

    useEffect(() => {
        fetchAjustes();
    }, []);

    return {
        ajustes: ajustesFiltrados,
        loading,
        error,
        search,
        setSearch,
        fetchAjustes,
        crearAjuste,
        eliminarAjuste,
    };
}