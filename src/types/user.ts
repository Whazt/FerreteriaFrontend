import type { Cliente } from "./cliente";
export interface User {
    id: number;
    email: string;
    rolId: number;
    // Relación opcional: no todos los usuarios tienen cliente (ej. admins)
    cliente?: Cliente;
}