export type TipoEntrega = "retiro_sucursal" | "envio";
export type MetodoPago = "efectivo_local" | "efectivo_contra_entrega";

export interface ProductoPedido {
    productoId: string;
    cantidad: number;
}

export interface PedidoData {
    productos: ProductoPedido[];
    tipoEntrega: TipoEntrega;
    metodoPago: MetodoPago;
    gastoEnvio: number;
}

export interface PedidoPayload {
    usuarioId: number;
    data: PedidoData;
}
