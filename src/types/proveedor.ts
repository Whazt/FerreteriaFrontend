export interface Proveedor {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProveedorFormData {
    nombre: string;
    telefono: string;
    email: string;
}