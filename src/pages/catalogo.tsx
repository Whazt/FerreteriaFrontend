import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import { ProductCard } from "../components/productCard";
import type { Product } from "../types/product";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCartStore";

export function CatalogoPage({ token }: { token?: string }) {
    const [productos, setProductos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // obtenés addItem directo del store
    const { items, addItem } = useCartStore();

    useEffect(() => {
        productService
        .getCatalogo()
        .then(setProductos)
        .catch((err) => {
            console.error("Error al cargar catálogo:", err);
            setProductos([]);
        })
        .finally(() => setLoading(false));
    }, []);

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

    if (loading) return <p>Cargando catálogo...</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-6">
        {productos.map((p) => (
            <ProductCard
            key={p.codProducto}
            producto={p}
            onAddToCart={handleAddToCart}
            />
        ))}
        </div>
    );
}
