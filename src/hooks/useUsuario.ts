import { useState, useRef } from "react";
import type { Usuario, UsuarioFormData, Meta } from "../types/usuario";
import { usuarioService } from "../services/usuarioService";

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guardamos los últimos parámetros de búsqueda para poder recargar la tabla tras editar
    const lastFetchParams = useRef({ page: 1, limit: 20, search: "" });

    const fetchUsuarios = async (
        page: number = 1,
        limit: number = 20,
        search: string = ""
    ) => {
        setLoading(true);
        setError(null);
        // Actualizamos la referencia con los parámetros actuales
        lastFetchParams.current = { page, limit, search };
        
        try {
            const response = await usuarioService.getAll(page, limit, search);
            setUsuarios(response.data);
            setMeta(response.meta);
        } catch (err: any) {
            setError(err.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const crearUsuario = async (data: UsuarioFormData) => {
        await usuarioService.create(data);
        // Recargar tabla usando los últimos filtros conocidos
        fetchUsuarios(
            lastFetchParams.current.page,
            lastFetchParams.current.limit,
            lastFetchParams.current.search
        );
    };

    const actualizarUsuario = async (id: number, data: Partial<UsuarioFormData>) => {
        await usuarioService.update(id, data);
        
        // RECARGAR TABLA: Refresca la vista manteniendo la página actual
        fetchUsuarios(
            lastFetchParams.current.page,
            lastFetchParams.current.limit,
            lastFetchParams.current.search
        );
    };

    const eliminarUsuario = async (id: number) => {
        await usuarioService.delete(id);
        // Opción A: Eliminar localmente (más rápido visualmente)
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        
        // Opción B: Recargar tabla (más seguro si hay paginación compleja)
        // fetchUsuarios(lastFetchParams.current.page, ...);
    };

    return {
        usuarios,
        meta,
        loading,
        error,
        fetchUsuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
    };
}