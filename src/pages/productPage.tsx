import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { productService } from "../services/productService"; // 🔹 servicio real
import { useCartStore } from "../store/useCartStore"; // 🔹 store del carrito
import { ICartIcon } from "../components/icons";
import type { Product } from "../types/product";
import toast from "react-hot-toast";

function ProductoPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { items, addItem } = useCartStore();

    useEffect(() => {
        if (!id) return;
        productService
        .getById(id)
        .then(setProduct)
        .catch(() => setProduct(null));
    }, [id]);

    if (!product) {
        return <div className="p-6">Producto no encontrado</div>;
    }

    const handleAddToCart = async () => {
        const existente = items.find((i) => i.productoId === product.codProducto);
        const cantidadActual = existente?.cantidad ?? 0;
        const stock = product.existencias ?? 0;

        if (stock === 0) {
        toast.error(`"${product.producto}" está agotado`);
        return;
        }

        if (cantidadActual + quantity > stock) {
        toast.error(`La cantidad que intenta agregar sobrepasa el máximo para "${product.producto}"`);
        return;
        }

        await addItem(
        {
            productoId: product.codProducto,
            cantidad: quantity,
            precio: Number(product.precio), // 🔹 forzado a número
            nombre: product.producto,
            imagenUrl: product.imagenUrl?.startsWith("/")
            ? product.imagenUrl
            : `/${product.imagenUrl}`,
            existencias: product.existencias,
        }
        );

        toast.success(`"${product.producto}" agregado al carrito`);
    };

    const handleIncrease = () => setQuantity((q) => q + 1);
    const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : q));

    return (
        <div className="container mx-auto mt-4 p-4">
        <div className="flex justify-between items-start">
            <div className="w-1/2">
            <img
                src={
                product.imagenUrl?.startsWith("/")
                    ? product.imagenUrl
                    : `/${product.imagenUrl}`
                }
                alt={product.producto}
                className="w-[60vh] h-auto rounded shadow"
            />
            </div>
            <div className="w-1/2 pl-8">
            <h1 className="text-3xl font-bold mb-2">{product.producto}</h1>
            <p className="text-xl font-semibold mb-2">C$ {product.precio}</p>
            <p className="text-lg mb-2">
                <strong>Código:</strong> {product.codProducto}
            </p>
            <p className="text-lg mb-2">
                <strong>Categoría:</strong>{" "}
                {product.categoria ? product.categoria.categoria : "Sin categoría"}
            </p>
            <p className="text-lg mb-4">
                <strong>Stock:</strong> {product.existencias}
            </p>
            <p className="text-lg mb-4">
                <strong>Descripción corta:</strong> {product.descripcion}
            </p>

            {/* 🔹 Control de cantidad y botones */}
            <div className="flex items-center mb-4">
                <div className="flex items-center border border-gray-300 rounded">
                <button onClick={handleDecrease} className="px-2 py-1">
                    -
                </button>
                <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-none"
                />
                <button onClick={handleIncrease} className="px-2 py-1">
                    +
                </button>
                </div>
                <button
                onClick={handleAddToCart}
                className="bg-orange-500 text-white px-4 py-2 rounded ml-2"
                >
                Agregar al carrito
                </button>
                <NavLink
                to="/Carrito"
                className="bg-orange-500 flex gap-2 text-white px-4 py-2 rounded ml-2"
                >
                <ICartIcon /> Ver carrito
                </NavLink>
            </div>
            </div>
        </div>

        {/* 🔹 Descripción */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Descripción:</h2>
            <p className="text-lg mb-4">{product.descripcion}</p>
        </div>
        </div>
    );
}

export default ProductoPage;
