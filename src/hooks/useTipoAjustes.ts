import { useState, useEffect, useMemo } from "react";
import type { TipoAjuste, TipoAjusteFormData } from "../types/tipoAjuste";
import { tipoAjusteService } from "../services/tipoAjusteService";

export function useTipoAjuste() {
    const [tipos, setTipos] = useState<TipoAjuste[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchTipos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tipoAjusteService.getAll();
            setTipos(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const crearTipo = async (data: TipoAjusteFormData) => {
        await tipoAjusteService.create(data);
        fetchTipos(); // Recargamos la lista
    };

    const actualizarTipo = async (id: number, data: TipoAjusteFormData) => {
        await tipoAjusteService.update(id, data);
        fetchTipos(); // Recargamos la lista
    };

    const eliminarTipo = async (id: number) => {
        await tipoAjusteService.delete(id);
        fetchTipos(); // Recargamos la lista
    };

    // Filtrado local para el buscador
    const tiposFiltrados = useMemo(() => {
        if (!search) return tipos;
        const lowerSearch = search.toLowerCase();
        return tipos.filter((t) => 
            t.tipoAjuste.toLowerCase().includes(lowerSearch) ||
            t.id.toString().includes(lowerSearch)
        );
    }, [tipos, search]);

    useEffect(() => {
        fetchTipos();
    }, []);

    return {
        tipos: tiposFiltrados, // Devolvemos la lista ya filtrada
        loading,
        error,
        search,
        setSearch,
        fetchTipos,
        crearTipo,
        actualizarTipo,
        eliminarTipo,
    };
}