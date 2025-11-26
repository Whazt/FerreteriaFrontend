import { NavLink } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { CartItemCard } from "./cartItemCard";

interface Props {
    visible: boolean;
    onClose: () => void;
    token?: string;
}

export function CartSidebar({ visible, onClose, token }: Props) {
    const { items, total, clearCart } = useCartStore();

    return (
        <div
        className={`fixed bottom-1 right-0 h-[99vh] w-96 bg-white border border-gray-300 rounded-lg shadow-xl transition-transform duration-300 z-50 ${
            visible ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Carrito</h2>
                <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-black"
                >
                ✕
                </button>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 min-h-0 overflow-y-auto text-center p-4 space-y-4">
                {items.length === 0 ? (
                <p>El carrito está vacío</p>
                ) : (
                items.map((item) => (
                    <CartItemCard
                    key={item.productoId}
                    productoId={item.productoId}
                    token={token}
                    />
                ))
                )}
            </div>

            {/* Footer fijo */}
            <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Total:</span>
                <span className="text-lg font-bold">C${total().toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                <button
                    className="flex-1 bg-gray-200 px-2 py-2 rounded hover:bg-gray-300"
                    onClick={() => clearCart(token)}
                >
                    Limpiar
                </button>
                <NavLink to="/Carrito" className="flex-1 bg-orange-500 text-white px-2 py-2 rounded hover:bg-orange-600" onClick={onClose}>
                    Ver Carrito
                </NavLink>
                </div>
            </div>
        </div>
    );
}