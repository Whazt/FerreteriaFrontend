import axios from "axios";
import type { Cliente } from "../types/cliente";

const API_URL = import.meta.env.VITE_API_URL+'clientes';

export async function getClientes(): Promise<Cliente[]> {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function getClienteById(id: number): Promise<Cliente> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
}

export async function crearCliente(data: Partial<Cliente>): Promise<Cliente> {
    const res = await axios.post(API_URL, data);
    return res.data;
}

export async function actualizarCliente(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
}

export async function eliminarCliente(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}
