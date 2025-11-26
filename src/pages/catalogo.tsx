import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { ProductCard } from "../components/productCard";
import { FiltersBar } from "../components/filtersBar";
import type { Product } from "../types/product";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCartStore";

type CatalogoMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
};

export function CatalogoPage({ token }: { token?: string }) {
    const [productos, setProductos] = useState<Product[]>([]);
    const [meta, setMeta] = useState<CatalogoMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const { items, addItem } = useCartStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const search = searchParams.get("search") || undefined;
        const categoriaId = searchParams.get("categoriaId") || undefined;
        const precioMin = searchParams.get("precioMin")
            ? Number(searchParams.get("precioMin"))
            : undefined;
        const precioMax = searchParams.get("precioMax")
            ? Number(searchParams.get("precioMax"))
            : undefined;

        setLoading(true);
        productService
            .getCatalogo(page, limit, search, categoriaId, precioMin, precioMax)
            .then((res) => {
                setProductos(res.data);
                setMeta(res.meta);
            })
            .catch((err) => {
                console.error("Error al cargar catálogo:", err);
                setProductos([]);
                setMeta(null);
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

    const handleAddToCart = async (productoId: string) => {
        const producto = productos.find((p) => p.codProducto === productoId);
        if (!producto) return;

        const existente = items.find((i) => i.productoId === productoId);
        const cantidadActual = existente?.cantidad ?? 0;
        const stock = producto.existencias ?? 0;

        if (stock === 0) {
            toast.error(`"${producto.producto}" está agotado`);
            return;
        }

        if (cantidadActual >= stock) {
            toast.error(`Stock máximo alcanzado para "${producto.producto}"`);
            return;
        }

        await addItem(
            {
                productoId: producto.codProducto,
                cantidad: 1,
                precio: producto.precio,
                nombre: producto.producto,
                imagenUrl: producto.imagenUrl,
                existencias: producto.existencias,
            },
            token
        );

        toast.success(`"${producto.producto}" agregado al carrito`);
    };

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        navigate(`/Catalogo?${params.toString()}`);
    };

    if (loading) return <p>Cargando catálogo...</p>;

    return (
        <div className="px-4 py-6">
            {/* 🔹 Barra de filtros arriba */}
            <FiltersBar />

            {/* 🔹 Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {productos.map((p) => (
                    <ProductCard
                        key={p.codProducto}
                        producto={p}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {/* 🔹 Paginación */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                        disabled={meta.page === 1}
                        onClick={() => goToPage(meta.page - 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1">
                        Página {meta.page} de {meta.totalPages}
                    </span>
                    <button
                        disabled={!meta.hasNext}
                        onClick={() => goToPage(meta.page + 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
