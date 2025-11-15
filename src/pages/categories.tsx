import { useEffect, useState } from "react";
import ListProducts from "../components/listProducts";
import type { Product } from "../components/listProducts";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
        try {
            setLoading(true);
            // 🔥 Cambia esta URL por la de tu backend real
            const res = await fetch("http://localhost:1234/productos");
            if (!res.ok) {
            throw new Error("Error al obtener productos");
            }
            const raw = await res.json();
            const productos = Array.isArray(raw) ? raw : raw.data;
            setProducts(productos);
            console.log(raw);
            console.log(productos)
            setError(null);
        } catch (err: any) {
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
        }

        loadProducts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
        {loading && <p className="text-center py-4">Cargando productos...</p>}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}
        {!loading && !error && <ListProducts products={products} />}
        </div>
    );
}

export default Products;
