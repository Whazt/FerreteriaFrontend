
export type Categoria = {
    id: string;
    categoria: string;
    descripcion: string;
};
export interface Product {
    codProducto: string;       
    producto: string;         
    descripcion: string;
    precio: number;           
    existencias: number;
    categoria: Categoria;
    costo: number;
    imagenUrl?: string;
    existenciaMax: number;
    existenciaMin: number;
    createdAt?: string;        
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
}