import type { Cliente } from "./cliente";
import type { Product } from "./product";

export type EstadoPedido = 'pendiente' | 'pagado' | 'enviado' | 'cancelado';
export type MetodoPago = 'efectivo_local' | 'efectivo_contra_entrega';
export type TipoEntrega = 'retiro_sucursal' | 'envio';

export interface DetallePedido {
    id: number;
    pedidoId: number;
    productoId: string;
    cantidad: number;
    precio: number;
    iva: number;
    producto?: Product; // Para mostrar nombre/foto en el detalle
}

export interface Pedido {
    id: number;
    clienteId: number;
    subtotal: string | number;
    iva: string | number;
    gastoEnvio: string | number;
    estado: EstadoPedido;
    metodoPago: MetodoPago;
    tipoEntrega: TipoEntrega;
    createdAt: string;
    updatedAt: string;
    cliente?: Cliente;
    detalles?: DetallePedido[];
}

// Estructura para enviar al backend
export interface PedidoItemInput {
    productoId: string;
    cantidad: number;
}

export interface PedidoCreatePayload {
    // Datos del pedido
    productos: PedidoItemInput[];
    metodoPago: MetodoPago;
    tipoEntrega: TipoEntrega;
    gastoEnvio?: number;
    // Dato auxiliar para saber a qué usuario (cliente) asociarlo
    usuarioId: number; 
}