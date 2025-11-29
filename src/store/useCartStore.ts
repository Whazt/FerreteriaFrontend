import { create } from "zustand";
import type { CartItem } from "../types/cart";
import { cartService } from "../services/cartService";
import { useAuthStore } from "./useAuthStore";

interface CartState {
    items: CartItem[];
    sessionId: string;
    loadCart: () => Promise<void>;
    addItem: (item: CartItem) => Promise<void>;
    incrementar: (productoId: string) => Promise<void>;
    disminuir: (productoId: string) => Promise<void>;
    removeItem: (productoId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    total: () => number;
    sincronizar: () => Promise<void>;
}

// 🔹 Normaliza los datos del producto al nivel raíz
function normalizeItem(item: CartItem): CartItem {
    const p = item.producto;
    return {
        ...item,
        precio: Number(p?.precio ?? item.precio ?? 0),
        nombre: p?.producto ?? item.nombre,
        imagenUrl: p?.imagenUrl ?? item.imagenUrl,
        existencias: p?.existencias ?? item.existencias,
    };
    }

    export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    sessionId: cartService.getSessionId(),

    getToken: () => useAuthStore.getState().accessToken,

    // Cargar carrito
    loadCart: async () => {
        const token = useAuthStore.getState().accessToken;
        const items = token
        ? await cartService.getCarrito(token)
        : cartService.getCarritoLocal();
        set({ items: items.map(normalizeItem) });
    },

    // Agregar producto
    addItem: async (item) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        const nuevo = await cartService.agregarProducto(token, item.productoId, item.cantidad);
        set((state) => {
        const existe = state.items.find((i) => i.productoId === nuevo.productoId);
        if (existe) {
            const combinado = normalizeItem({
            ...existe,
            cantidad: existe.cantidad + item.cantidad,
            producto: nuevo.producto,
            });
            return {
            items: state.items.map((i) =>
                i.productoId === nuevo.productoId ? combinado : i
            ),
            };
        }
        return { items: [...state.items, normalizeItem(nuevo)] };
        });
        } else {
        const updated = cartService.addProductoLocal(item);
        set({ items: updated.map(normalizeItem) });
        }
    },

    // Incrementar cantidad
    incrementar: async (productoId) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        const actualizado = await cartService.incrementar(token, productoId);
        const normalizado = normalizeItem(actualizado);
        set((state) => ({
            items: state.items.map((i) =>
            i.productoId === productoId ? { ...i, ...normalizado } : i
            ),
        }));
        } else {
        const updated = cartService.incrementarLocal(productoId);
        set({ items: updated.map(normalizeItem) });
        }
    },

    // Disminuir cantidad
    disminuir: async (productoId) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        const res = await cartService.disminuir(token, productoId);
        if ("eliminado" in res) {
            set((state) => ({
            items: state.items.filter((i) => i.productoId !== productoId),
            }));
        } else {
            const normalizado = normalizeItem(res);
            set((state) => ({
            items: state.items.map((i) =>
                i.productoId === productoId ? { ...i, ...normalizado } : i
            ),
            }));
        }
        } else {
        const updated = cartService.disminuirLocal(productoId);
        set({ items: updated.map(normalizeItem) });
        }
    },

    // Eliminar producto
    removeItem: async (productoId) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        await cartService.eliminarProducto(token, productoId);
        set((state) => ({
            items: state.items.filter((i) => i.productoId !== productoId),
        }));
        } else {
        const updated = cartService.eliminarProductoLocal(productoId);
        set({ items: updated.map(normalizeItem) });
        }
    },

    // Limpiar carrito
    clearCart: async () => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        await cartService.limpiarCarrito(token);
        set({ items: [] });
        } else {
        const cleared = cartService.limpiarCarritoLocal();
        set({ items: cleared.map(normalizeItem) });
        }
    },

    // Calcular total
    total: () =>
        get().items.reduce((acc, i) => acc + (i.precio ?? 0) * i.cantidad, 0),

    // Migrar carrito local al backend al loguearse
    sincronizar: async () => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
        const migrated = await cartService.sincronizarCarritoLocal(token);
        set({ items: migrated.map(normalizeItem) });
        }
    },
}));
