import { useState, useEffect, useMemo } from "react";
import type { Proveedor, ProveedorFormData } from "../types/proveedor";
import { proveedorService } from "../services/proveedorService";

export function useProveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchProveedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await proveedorService.getAll();
            setProveedores(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar proveedores");
        } finally {
            setLoading(false);
        }
    };

    const crearProveedor = async (data: ProveedorFormData) => {
        await proveedorService.create(data);
        fetchProveedores(); // Recargar lista
    };

    const actualizarProveedor = async (id: number, data: ProveedorFormData) => {
        await proveedorService.update(id, data);
        fetchProveedores(); // Recargar lista
    };

    const eliminarProveedor = async (id: number) => {
        await proveedorService.delete(id);
        fetchProveedores(); // Recargar lista
    };

    // Filtrado local por nombre, email o teléfono
    const proveedoresFiltrados = useMemo(() => {
        if (!search) return proveedores;
        const lowerSearch = search.toLowerCase();
        return proveedores.filter((p) => 
            p.nombre.toLowerCase().includes(lowerSearch) ||
            p.email.toLowerCase().includes(lowerSearch) ||
            p.telefono.includes(lowerSearch)
        );
    }, [proveedores, search]);

    useEffect(() => {
        fetchProveedores();
    }, []);

    return {
        proveedores: proveedoresFiltrados,
        loading,
        error,
        search,
        setSearch,
        fetchProveedores,
        crearProveedor,
        actualizarProveedor,
        eliminarProveedor,
    };
}