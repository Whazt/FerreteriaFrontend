import type { CartItem } from "../types/cart";

const API_URL = import.meta.env.VITE_API_URL;

// SessionId para usuarios sin login
const getSessionId = (): string => {
    const existing = localStorage.getItem("sessionId");
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem("sessionId", newId);
    return newId;
};

export const cartService = {
    // 🔒 Métodos con login (backend)

    async getCarrito(token: string): Promise<CartItem[]> {
        const res = await fetch(`${API_URL}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener carrito");
        return await res.json();
    },

    async agregarProducto(token: string, productoId: string, cantidad: number): Promise<CartItem> {
        const res = await fetch(`${API_URL}/carrito`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId, cantidad }),
        });
        if (!res.ok) throw new Error("Error al agregar producto");
        return await res.json();
    },

    async incrementar(token: string, productoId: string): Promise<CartItem> {
        const res = await fetch(`${API_URL}/carrito`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId, operacion: "sumar" }),
        });
        if (!res.ok) throw new Error("Error al incrementar cantidad");
        return await res.json();
    },

    async disminuir(token: string, productoId: string): Promise<CartItem | { eliminado: true }> {
        const res = await fetch(`${API_URL}/carrito`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId, operacion: "restar" }),
        });
        if (!res.ok) throw new Error("Error al disminuir cantidad");
        return await res.json();
    },

    async eliminarProducto(token: string, productoId: string): Promise<{ ok: true }> {
        const res = await fetch(`${API_URL}/carrito`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId }),
        });
        if (!res.ok) throw new Error("Error al eliminar producto");
        return await res.json();
    },

    async limpiarCarrito(token: string): Promise<{ ok: true }> {
        const res = await fetch(`${API_URL}/carrito/limpiar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al limpiar carrito");
        return await res.json();
    },

    async calcularTotal(token: string): Promise<{ total: number }> {
        const res = await fetch(`${API_URL}/carrito/total`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al calcular total");
        return await res.json();
    },

    async sincronizarCarritoLocal(token: string): Promise<CartItem[]> {
        const items = cartService.getCarritoLocal();
        const res = await fetch(`${API_URL}/carrito/sincronizar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
        });
        if (!res.ok) throw new Error("Error al sincronizar carrito local");
        const carrito = await res.json();
        localStorage.removeItem("cartItems");
        return carrito;
    },

    // 🟢 Métodos sin login (localStorage)

    getSessionId,

    getCarritoLocal(): CartItem[] {
        const items = localStorage.getItem("cartItems");
        return items ? JSON.parse(items) : [];
    },

    addProductoLocal(producto: CartItem): CartItem[] {
        const items = cartService.getCarritoLocal();
        const exists = items.find((i) => i.productoId === producto.productoId);
        const updated = exists
        ? items.map((i) =>
            i.productoId === producto.productoId
                ? { ...i, cantidad: i.cantidad + producto.cantidad }
                : i
            )
        : [...items, producto];
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
    },

    incrementarLocal(productoId: string): CartItem[] {
        const updated = cartService.getCarritoLocal().map((i) =>
        i.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
        );
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
    },

    disminuirLocal(productoId: string): CartItem[] {
        const updated = cartService
        .getCarritoLocal()
        .map((i) => {
            if (i.productoId === productoId) {
            if (i.cantidad - 1 <= 0) {
                return null; // eliminar
            }
            return { ...i, cantidad: i.cantidad - 1 };
            }
            return i;
        })
        .filter(Boolean) as CartItem[];
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
    },

    eliminarProductoLocal(productoId: string): CartItem[] {
        const updated = cartService.getCarritoLocal().filter((i) => i.productoId !== productoId);
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
    },

    limpiarCarritoLocal(): CartItem[] {
        localStorage.removeItem("cartItems");
        return [];
    },

    calcularTotalLocal(): number {
        return cartService
        .getCarritoLocal()
        .reduce((acc, i) => acc + (i.precio ?? 0) * i.cantidad, 0);
    },
};
