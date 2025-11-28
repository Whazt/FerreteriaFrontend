import { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { crearPedido } from "../services/pedidoService";
import { crearDireccion } from "../services/direccionService";
import { userService } from "../services/userService";
import { useAuthStore } from "../store/useAuthStore"; // tu store de auth
import type { PedidoPayload } from "../types/pedido";
import type { User } from "../types/user";
import toast from "react-hot-toast";
import type { TipoEntrega } from "../types/pedido";

interface Props {
    user: User;       // solo el básico del authStore
    onClose: () => void;
}

export function CheckoutModal({ user, onClose }: Props) {
    const accessToken = useAuthStore(state => state.accessToken);// 🔹 el accessToken se recupera del store, no como prop
    const items = useCartStore(state => state.items);
    const clearCart = useCartStore(state => state.clearCart);
    const total = useCartStore(state => state.total);

    const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | "">("");
    const [direccion, setDireccion] = useState("");
    const [referencias, setReferencias] = useState("");
    const [editDireccion, setEditDireccion] = useState(false);
    const [clienteUser, setClienteUser] = useState<User | null>(null);

    const subtotal = total();
    const iva = subtotal * 0.15;
    const grandTotal = subtotal + iva;

    // 🔹 Recuperar cliente y direcciones al montar
    useEffect(() => {
    (async () => {
        if (!accessToken) return; // 🔒 Evita llamada con token nulo
        try {
        const fullUser = await userService.getById(accessToken, user.id);
        setClienteUser(fullUser);
        if (fullUser.cliente?.direcciones?.length) {
            setDireccion(fullUser.cliente.direcciones[0].direccion);
        }
        } catch (error) {
        console.error("Error al recuperar cliente:", error);
        }
    })();
    }, [accessToken, user.id]);


    const handleConfirmar = async () => {
        if (items.length === 0) {
        toast.error(" No hay productos en el carrito");
        return;
        }
        if (tipoEntrega === "") {
        toast.error(" Selecciona tipo de entrega");
        return;
        }

        try {
        // Si es envío y no hay direcciones, crear una nueva
        if (tipoEntrega === "envio" && !clienteUser?.cliente?.direcciones?.length) {
            await crearDireccion({
            direccion,
            referencias,
            cliente_id: clienteUser?.cliente?.id,
            municipio_id: 1, // Managua hardcodeado
            por_defecto: true
            });
        }

        const payload: PedidoPayload = {
            usuarioId: user.id,
            data: {
            productos: items.map(p => ({
                productoId: p.productoId,
                cantidad: p.cantidad
            })),
            tipoEntrega,
            metodoPago: tipoEntrega === "envio"
                ? "efectivo_contra_entrega"
                : "efectivo_local",
            gastoEnvio: tipoEntrega === "envio" ? 150.0 : 0.0
            }
        };

        await crearPedido(payload);
        await clearCart();
        toast.success(" Pedido creado correctamente");
        onClose();
        } catch (err) {
        console.error("Error al crear pedido:", err);
        toast.error(" No se pudo crear el pedido");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl w-[550px] shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">
            🛒 Finalizar compra
            </h2>

            {/* Resumen del carrito */}
            <div className="mb-6">
            <p className="font-semibold mb-2">Productos:</p>
            <ul className="list-disc pl-5 text-gray-700">
                {items.map(item => (
                <li key={item.productoId}>
                    {item.nombre} x {item.cantidad} — C${(item.precio ?? 0) * item.cantidad}
                </li>
                ))}
            </ul>
            <p className="mt-4 font-bold text-lg text-gray-900">
                Total (IVA incluido): C${grandTotal.toFixed(2)}
            </p>
            </div>

            {/* Tipo de entrega */}
            <div className="mb-6">
            <p className="font-semibold mb-2">Tipo de entrega:</p>
            <label className="block cursor-pointer">
                <input
                type="radio"
                value="retiro_sucursal"
                checked={tipoEntrega === "retiro_sucursal"}
                onChange={() => setTipoEntrega("retiro_sucursal")}
                className="mr-2 accent-blue-600"
                />
                Retiro en sucursal
            </label>
            <label className="block cursor-pointer mt-2">
                <input
                type="radio"
                value="envio"
                checked={tipoEntrega === "envio"}
                onChange={() => setTipoEntrega("envio")}
                className="mr-2 accent-blue-600"
                />
                Envío con costo adicional
            </label>
            </div>

            {/* Dirección si es envío */}
            {tipoEntrega === "envio" && (
            <div className="mb-6">
                <p className="font-semibold mb-2">Dirección de entrega:</p>
                {clienteUser?.cliente?.direcciones?.length && !editDireccion ? (
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                    {clienteUser.cliente.direcciones[0].direccion}
                    </span>
                    <button
                    onClick={() => setEditDireccion(true)}
                    className="text-blue-600 hover:underline"
                    >
                    Modificar
                    </button>
                </div>
                ) : (
                <>
                    <input
                    type="text"
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Dirección exacta"
                    className="w-full border rounded px-3 py-2 mb-2 focus:ring focus:ring-blue-300"
                    />
                    <input
                    type="text"
                    value={referencias}
                    onChange={e => setReferencias(e.target.value)}
                    placeholder="Referencias (opcional)"
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                    * Las entregas están disponibles únicamente en Managua.
                    </p>
                </>
                )}
            </div>
            )}

            {/* Método de pago */}
            <div className="mb-6">
            <p className="font-semibold mb-2">Método de pago:</p>
            <p className="text-gray-700 italic">
                {tipoEntrega === "envio"
                ? "Pago en efectivo al recibir"
                : tipoEntrega === "retiro_sucursal"
                ? "Pago en efectivo en el local"
                : "Selecciona tipo de entrega"}
            </p>
            </div>

            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
            >
                Cancelar
            </button>
            <button
                disabled={!tipoEntrega || items.length === 0}
                onClick={handleConfirmar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
            >
                Confirmar pedido
            </button>
            </div>
        </div>
        </div>
    );
}
