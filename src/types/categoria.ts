export interface Categoria {
    id: number;
    categoria: string; // Coincide con tu BD
    descripcion?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoriaFormData {
    categoria: string;
    descripcion?: string;
}