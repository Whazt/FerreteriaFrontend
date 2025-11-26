import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { SmallTrashIcon } from "../components/icons";
import { NavLink } from "react-router-dom";
import type { CartItem } from "../types/cart";

function CartItemCard({
    item,
    incrementar,
    disminuir,
    removeItem,
    }: {
    item: CartItem;
    incrementar: (id: string) => void;
    disminuir: (id: string) => void;
    removeItem: (id: string) => void;
    }) {
    const precioUnit = item.producto
        ? item.producto.precio
        : Number(item.precio ?? 0);
    const existencias = item.producto
        ? item.producto.existencias
        : Number(item.existencias ?? Infinity);
    const total = precioUnit * item.cantidad;

    const formattedPrice = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
    }).format(precioUnit);

    const formattedTotal = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
    }).format(total);

    return (
        <div className="flex flex-col md:flex-row items-center p-4 border-b border-gray-200">
        <img
            className="w-32 h-32 object-cover"
            src={item.imagenUrl || "/placeholder.svg"}
            alt={item.nombre ?? item.producto?.producto ?? "Producto"}
        />
        <div className="flex-1 ml-4">
            <h2 className="text-xl font-bold">
            {item.nombre ?? item.producto?.producto ?? "Producto"}
            </h2>
            <div className="flex items-center mt-2">
            <span className="text-lg">Cant.: </span>
            <div className="flex ml-2 items-center border border-gray-300 rounded">
                <button
                className="px-2 py-1 text-gray-600"
                onClick={() => disminuir(item.productoId)}
                disabled={item.cantidad <= 1}
                >
                -
                </button>
                <span className="px-2">{item.cantidad}</span>
                <button
                className="px-2 py-1 text-gray-600"
                onClick={() => incrementar(item.productoId)}
                disabled={item.cantidad >= existencias}
                >
                +
                </button>
            </div>
            </div>
            <p className="mt-2">Precio unitario: {formattedPrice}</p>
            <p className="mt-2 font-semibold">Total: {formattedTotal}</p>
            <button
            className="mt-2 flex items-center text-red-500 gap-1"
            onClick={() => removeItem(item.productoId)}
            >
            <SmallTrashIcon /> Quitar del carrito
            </button>
        </div>
        </div>
    );
    }

    export function Carrito() {
    const { items, incrementar, disminuir, removeItem, clearCart, total } =
        useCartStore();
    const [subtotal, setSubtotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [iva, setIva] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const newSubtotal = total();
        const newTotalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
        const newIva = newSubtotal * 0.15; // 🔹 IVA del 15%
        const newGrandTotal = newSubtotal + newIva;

        setSubtotal(newSubtotal);
        setTotalItems(newTotalItems);
        setIva(newIva);
        setGrandTotal(newGrandTotal);
    }, [items, total]);

    const formattedSubtotal = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
    }).format(subtotal);

    const formattedIva = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
    }).format(iva);

    const formattedGrandTotal = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
    }).format(grandTotal);

    return (
        <div className="container mx-auto p-4 mt-16">
        <h1 className="text-3xl font-bold mb-4">Mi carrito de compras</h1>

        <div className="flex flex-col xl:flex-row">
            {/* Lista de productos */}
            <div className="grow">
            {items.length === 0 ? (
                <p className="text-gray-600">Tu carrito está vacío</p>
            ) : (
                items.map((item) => (
                <CartItemCard
                    key={item.productoId}
                    item={item}
                    incrementar={incrementar}
                    disminuir={disminuir}
                    removeItem={removeItem}
                />
                ))
            )}
            </div>

            {/* Resumen del pedido */}
            <div className="w-full xl:w-1/4 p-4 border-t xl:border-t-0 xl:border-l border-gray-200">
            <h2 className="text-xl font-bold mb-4">Total del pedido</h2>
            <div className="flex justify-between mb-2">
                <span>Subtotal ({totalItems} productos):</span>
                <span>{formattedSubtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span>IVA (15%):</span>
                <span>{formattedIva}</span>
            </div>
            <div className="flex justify-between mb-4 font-bold">
                <span>Total:</span>
                <span>{formattedGrandTotal}</span>
            </div>
            <div>
                <button
                className="block w-full bg-orange-400 hover:bg-orange-500 text-white py-2 mb-4 rounded text-center"
                onClick={() => alert("Checkout pendiente")}
                >
                Ir a Pagar
                </button>
                <NavLink
                to="/"
                className="block w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded mb-12 text-center"
                >
                Continuar Comprando
                </NavLink>
            </div>
            <div>
                <button
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded mt-12"
                onClick={() => clearCart()}
                >
                Limpiar Carrito
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
