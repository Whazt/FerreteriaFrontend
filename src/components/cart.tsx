import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { CartSidebar } from "./cartSidebar";
import { BagIcon } from "./icons";

export function Cart({ token }: { token?: string }) {
    const [visible, setVisible] = useState(false);
    const { total, items } = useCartStore();

    // cantidad total de ítems
    const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

    return (
        <>
        {/* Botón en el navbar */}
        <div className="flex items-center relative">
            <button
                onClick={() => setVisible(true)}
                className="relative flex items-center text-xl gap-2 rounded px-4 py-2 text-orange-500"
            >
                <BagIcon />
                {cantidad > 0 && (
                <span className="absolute top-1 -right-1 bg-orange-400 border-2 border-white text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {cantidad}
                </span>
                )}
            </button>

            <span className="ml-2 text-lg font-semibold hidden md:block">
                C${total().toFixed(2)}
            </span>
        </div>
        
        {/* Sidebar */}
        <CartSidebar
            visible={visible}
            onClose={() => setVisible(false)}
            token={token}
        />
        </>
    );
}
