import axios from "axios";
import type { PedidoPayload } from "../types/pedido";

const API_URL = import.meta.env.VITE_API_URL+'/pedidos';

export async function getPedidos() {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function getPedidoById(id: number) {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
}

export async function getPedidosByCliente(clienteId: number) {
    const res = await axios.get(`${API_URL}/cliente/${clienteId}`);
    return res.data;
}

export async function crearPedido(payload: PedidoPayload) {
    const res = await axios.post(API_URL, payload);
    return res.data;
}

export async function actualizarEstadoPedido(id: number, nuevoEstado: string) {
    const res = await axios.put(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
    return res.data;
}

export async function eliminarPedido(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}
