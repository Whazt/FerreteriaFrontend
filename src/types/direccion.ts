export interface Direccion {
    id: number;
    direccion: string;        // Calle y número
    referencias?: string;     // Opcional
    cliente_id: number;       // Relación con cliente
    municipio_id: number;     // Relación con municipio
    por_defecto: boolean;     // True si es la dirección principal
}
