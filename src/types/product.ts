export interface Product {
    codProducto: string;       
    producto: string;         
    descripcion: string;
    precio: number;           
    existencias: number;
    categoriaId: number;
    costo: number;
    imagenUrl?: string;
    existenciaMax: number;
    existenciaMin: number;
    createdAt?: string;        
    updatedAt?: string;
    deletedAt?: string | null;
}
