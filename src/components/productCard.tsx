import { AddToCartButton } from "./addToCartButton";
import type { Product } from "../types/product";

interface ProductCardProps {
    producto: Product;
    onAddToCart: (productoId: string) => void;
}

export function ProductCard({ producto, onAddToCart }: ProductCardProps) {
    const isOutOfStock = producto.existencias === 0;

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md">
        {/* Imagen del producto */}
            <div className="relative h-60 w-full overflow-hidden bg-muted">
                {producto.imagenUrl ? (
                <img
                    src={producto.imagenUrl}
                    alt={producto.producto}
                    className="w-full object-contain max-h-60"
                />
                ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                    Sin imagen
                </div>
                )}
                {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="text-sm font-semibold text-white">Sin existencias</span>
                </div>
                )}
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                {producto.producto}
                </h3>

                <div className="mt-auto space-y-2 pt-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                    ${producto.precio.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span
                    className={`text-xs font-medium ${
                        isOutOfStock ? "text-destructive" : "text-green-600"
                    }`}
                    >
                    {producto.existencias > 0 ? `${producto.existencias} disponibles` : "Agotado"}
                    </span>
                </div>
                </div>

                <AddToCartButton
                disabled={isOutOfStock}
                onClick={() => onAddToCart(producto.codProducto)}
                />
            </div>
        </div>
    );
}
