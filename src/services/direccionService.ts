import axios from "axios";
import type { Direccion } from "../types/direccion";

const API_URL = import.meta.env.VITE_API_URL+'/direcciones';

export async function getDirecciones(): Promise<Direccion[]> {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function getDireccionById(id: number): Promise<Direccion> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
}

export async function crearDireccion(data: Partial<Direccion>): Promise<Direccion> {
    const res = await axios.post(API_URL, data);
    return res.data;
}

export async function actualizarDireccion(id: number, data: Partial<Direccion>): Promise<Direccion> {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
}

export async function eliminarDireccion(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}
