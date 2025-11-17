import { create } from "zustand";
import type { CartItem } from "../types/cart";
import { cartService } from "../services/cartService";

interface CartState {
    items: CartItem[];
    sessionId: string;
    loadCart: (token?: string) => Promise<void>;
    addItem: (item: CartItem, token?: string) => Promise<void>;
    incrementar: (productoId: string, token?: string) => Promise<void>;
    disminuir: (productoId: string, token?: string) => Promise<void>;
    removeItem: (productoId: string, token?: string) => Promise<void>;
    clearCart: (token?: string) => Promise<void>;
    total: () => number;
    sincronizar: (token: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    sessionId: cartService.getSessionId(),

    // Cargar carrito
    loadCart: async (token) => {
        if (token) {
        const items = await cartService.getCarrito(token);
        set({ items });
        } else {
        const items = cartService.getCarritoLocal();
        set({ items });
        }
    },

    // Agregar producto
    addItem: async (item, token) => {
        if (token) {
        const nuevo = await cartService.agregarProducto(token, item.productoId, item.cantidad);
        set((state) => {
            const existe = state.items.find((i) => i.productoId === nuevo.productoId);
            if (existe) {
            return {
                items: state.items.map((i) =>
                i.productoId === nuevo.productoId
                    ? { ...i, cantidad: i.cantidad + item.cantidad }
                    : i
                ),
            };
            }
            return { items: [...state.items, nuevo] };
        });
        } else {
        const updated = cartService.addProductoLocal(item);
        set({ items: updated });
        }
    },

    // Incrementar cantidad
    incrementar: async (productoId, token) => {
        if (token) {
        const actualizado = await cartService.incrementar(token, productoId);
        set((state) => ({
            items: state.items.map((i) =>
            i.productoId === actualizado.productoId
                ? { ...i, cantidad: actualizado.cantidad }
                : i
            ),
        }));
        } else {
        const updated = cartService.incrementarLocal(productoId);
        set({ items: updated });
        }
    },

    // Disminuir cantidad
    disminuir: async (productoId, token) => {
        if (token) {
        const res = await cartService.disminuir(token, productoId);
        if ("eliminado" in res) {
            set((state) => ({
            items: state.items.filter((i) => i.productoId !== productoId),
            }));
        } else {
            set((state) => ({
            items: state.items.map((i) =>
                i.productoId === res.productoId
                ? { ...i, cantidad: res.cantidad }
                : i
            ),
            }));
        }
        } else {
        const updated = cartService.disminuirLocal(productoId);
        set({ items: updated });
        }
    },

    // Eliminar producto
    removeItem: async (productoId, token) => {
        if (token) {
        await cartService.eliminarProducto(token, productoId);
        set((state) => ({
            items: state.items.filter((i) => i.productoId !== productoId),
        }));
        } else {
        const updated = cartService.eliminarProductoLocal(productoId);
        set({ items: updated });
        }
    },

    // Limpiar carrito
    clearCart: async (token) => {
        if (token) {
        await cartService.limpiarCarrito(token);
        set({ items: [] });
        } else {
        const cleared = cartService.limpiarCarritoLocal();
        set({ items: cleared });
        }
    },

    // Calcular total
    total: () =>
        get().items.reduce((acc, i) => {
        // si viene del backend → usa producto.precio
        if (i.producto) return acc + i.producto.precio * i.cantidad;
        // si es local → usa precio guardado
        return acc + (i.precio ?? 0) * i.cantidad;
        }, 0),

    // Migrar carrito local al backend al loguearse
    sincronizar: async (token) => {
        const migrated = await cartService.sincronizarCarritoLocal(token);
        set({ items: migrated });
    },
}));
