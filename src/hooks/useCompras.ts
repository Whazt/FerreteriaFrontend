import { useState, useEffect } from "react";
import type { Compra, CompraCreatePayload } from "../types/compra";
import { compraService } from "../services/compraService";

export function useCompras() {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompras = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await compraService.getAll();
            // Ordenar por ID descendente para ver las nuevas primero
            setCompras(data.sort((a, b) => b.id - a.id));
        } catch (err: any) {
            setError(err.message || "Error al cargar compras");
        } finally {
            setLoading(false);
        }
    };

    const crearCompra = async (data: CompraCreatePayload) => {
        await compraService.create(data);
        fetchCompras(); 
    };

    const aplicarCompra = async (id: number) => {
        try {
            await compraService.aplicar(id);
            fetchCompras(); // Recargar para ver el estado actualizado
        } catch (err: any) {
            alert(err.message); // Mostrar error si falla la aplicación (ej: stock negativo al revertir)
        }
    };

    const eliminarCompra = async (id: number) => {
        try {
            await compraService.delete(id);
            fetchCompras();
        } catch (err: any) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    return {
        compras,
        loading,
        error,
        fetchCompras,
        crearCompra,
        aplicarCompra,
        eliminarCompra,
    };
}