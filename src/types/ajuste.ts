import type { Product } from "./product";
import type { TipoAjuste } from "./tipoAjuste";
import type { Usuario } from "./usuario";

export interface Ajuste {
    id: number;
    productoId: string;
    tipoAjusteId: number;
    cantidad: number;
    accion: 'aumento' | 'disminucion';
    observacion: string;
    usuarioId: number;
    createdAt: string;
    updatedAt: string;
    // Relaciones (pueden venir populadas)
    producto?: Product;
    tipoAjuste?: TipoAjuste;
    usuario?: Usuario;
}

export interface AjusteCreatePayload {
    productoId: string;
    tipoAjusteId: number;
    cantidad: number;
    accion: 'aumento' | 'disminucion';
    observacion: string;
    usuarioId: number;
}