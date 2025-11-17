import { useCartStore } from "../store/useCartStore";
import {  TrashIcon } from "./icons";

interface CartItemCardProps {
    productoId: string;
    token?: string;
}

export function CartItemCard({ productoId, token }: CartItemCardProps) {
    const { items, incrementar, disminuir, removeItem } = useCartStore();
    const item = items.find((i) => i.productoId === productoId);
    if (!item) return null;

    const precioUnit = item.producto ? item.producto.precio : (item.precio ?? 0);
    const total = precioUnit * item.cantidad;
    const existencias = item.producto ? item.producto.existencias : (item.existencias ?? 0);;

    const handleDecrement = () => {
        if (item.cantidad > 1) {
        disminuir(productoId, token);
        }
    };

    const handleIncrement = () => {
        if (item.cantidad < existencias) {
        incrementar(productoId, token);
        }
    };

    const handleRemove = () => {
        removeItem(productoId, token);
    };

    return (
        <div className="overflow-hidden border border-gray-300 bg-white p-3 rounded-md">
        <div className="flex gap-3">
            {/* Imagen  */}
            <div className="h-25 w-25 shrink-0 overflow-hidden rounded-md bg-gray-100">
                <img
                    src={item.imagenUrl || "/placeholder.svg"}
                    alt={item.nombre}
                    className="h-full w-full object-cover"
                />
            </div>
            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
            <div className="space-y-1">
                <h3 className="line-clamp-2 text-md font-medium text-gray-800">
                {item.nombre}
                </h3>
                <p className="text-xs text-gray-500">
                C${precioUnit.toFixed(2)}
                </p>
                <div className="text-xs text-gray-500 font-medium">
                {item.cantidad}/{existencias}
                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* Controles de cantidad */}
                <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-100 p-1">
                <button
                    className="flex h-6 w-6 text-md p-0 text-xl justify-center items-center text-red-500 hover:text-red-600 hover:bg-gray-200 rounded"
                    onClick={handleDecrement}
                >
                    -
                </button>
                <button
                    className=" flex h-6 w-6 text-center text-xl justify-center items-center p-0 text-green-500 hover:text-green-600 hover:bg-gray-200 rounded"
                    onClick={handleIncrement}
                >
                    +
                </button>
                </div>

                {/* Total y eliminar */}
                <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                    C${total.toFixed(2)}
                </span>
                <button
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    onClick={handleRemove}
                    title="Eliminar"
                >
                    <TrashIcon/>
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
