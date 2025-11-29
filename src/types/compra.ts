import type { Proveedor } from "./proveedor"; // Asumiendo que existe
import type { Product } from "./product";     // Asumiendo que existe

export interface DetalleCompra {
    id: number;
    compraId: number;
    productoId: string; // codProducto es string
    cantidad: number;
    precioCompra: number; // Precio unitario
    iva: number;
    // Opcional para mostrar datos del producto en la tabla de detalles
    producto?: Product; 
}

export interface Compra {
    id: number;
    proveedorId: number;
    subtotal: number;
    iva: number;
    estado: 'registrada' | 'aplicada';
    createdAt: string;
    updatedAt: string;
    detalles?: DetalleCompra[];
    proveedor?: Proveedor;
}

// Estructura para crear una nueva compra (Payload)
export interface CompraItemInput {
    productoId: string;
    cantidad: number;
    precio: number;
}

export interface CompraCreatePayload {
    proveedorId: number;
    items: CompraItemInput[];
}