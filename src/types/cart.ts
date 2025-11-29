import type { Product } from "./product";

export interface CartItem {
    usuarioId?: number;          // opcional: solo si hay login
    productoId: string;          // siempre presente
    cantidad: number;            // siempre presente
    precio?: number;             // obligatorio en modo local (sin login)
    nombre?: string;             // opcional para renderizar rápido sin login
    existencias?: number; 
    imagenUrl?: string;          // opcional para renderizar rápido sin login
    producto?: Product;      
}

export interface CartState {
    items: CartItem[];
    sessionId: string;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    setUserId: (userId: number) => void; // corregido: debe ser number, no string
    total: () => number;
    }