export interface TipoAjuste {
    id: number;
    tipoAjuste: string;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
}

export interface TipoAjusteFormData {
    tipoAjuste: string;
}