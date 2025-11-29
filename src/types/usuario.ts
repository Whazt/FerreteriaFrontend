export interface Usuario {
    id: number;
    email: string;
    rolId: number;
    // La contraseña hash no se suele mostrar en la tabla, pero el tipo existe
    contrasenaHash?: string; 
    createdAt?: string;
}

export interface UsuarioFormData {
    email: string;
    rolId: number;
    password?: string; // Enviamos 'password' plano para que el backend lo hashee
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
}

export interface UsuarioResponse {
    data: Usuario[];
    meta: Meta;
    mensaje?: string;
}