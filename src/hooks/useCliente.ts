import { useState, useEffect, useMemo } from "react";
import type { Cliente, ClienteFormData } from "../types/cliente";
import { clienteService } from "../services/clienteService";

export function useClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await clienteService.getAll();
            setClientes(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar clientes");
        } finally {
            setLoading(false);
        }
    };

    const crearCliente = async (data: ClienteFormData) => {
        await clienteService.create(data);
        fetchClientes(); // Recargar lista
    };

    const actualizarCliente = async (id: number, data: ClienteFormData) => {
        await clienteService.update(id, data);
        fetchClientes(); // Recargar lista
    };

    const eliminarCliente = async (id: number) => {
        await clienteService.delete(id);
        fetchClientes(); // Recargar lista
    };

    // Filtrado local
    const clientesFiltrados = useMemo(() => {
        if (!search) return clientes;
        const lowerSearch = search.toLowerCase();
        return clientes.filter((c) => 
            c.nombres.toLowerCase().includes(lowerSearch) ||
            c.apellidos.toLowerCase().includes(lowerSearch) ||
            c.telefono.includes(lowerSearch)
        );
    }, [clientes, search]);

    useEffect(() => {
        fetchClientes();
    }, []);

    return {
        clientes: clientesFiltrados,
        loading,
        error,
        search,
        setSearch,
        fetchClientes,
        crearCliente,
        actualizarCliente,
        eliminarCliente,
    };
}