import  type { Direccion } from "./direccion";

export interface Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    usuarioId: number;
    direcciones?: Direccion[]; // puede traer varias, pero filtramos la por_defecto
}

export interface Clientes {
    id: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    usuarioId: number; // Relación con Usuarios
    createdAt?: string;
    updatedAt?: string;
}

export interface ClienteFormData {
    nombres: string;
    apellidos: string;
    telefono: string;
    usuarioId: number;
}

