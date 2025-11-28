import  type { Direccion } from "./direccion";

export interface Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    usuarioId: number;
    direcciones?: Direccion[]; // puede traer varias, pero filtramos la por_defecto
}

