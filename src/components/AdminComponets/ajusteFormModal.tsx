import { useState, useEffect } from "react";
import type { AjusteCreatePayload } from "../../types/ajuste";
import { useProducts } from "../../hooks/useProduct";
import { useTipoAjuste } from "../../hooks/useTipoAjustes";
import { useUsuarios } from "../../hooks/useUsuario";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: AjusteCreatePayload) => Promise<void>;
};

const initialForm: AjusteCreatePayload = {
    productoId: "",
    tipoAjusteId: 0,
    cantidad: 1,
    accion: "aumento", // Default
    observacion: "",
    usuarioId: 0
};

export default function AjusteFormModal({ open, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<AjusteCreatePayload>(initialForm);
    const [loading, setLoading] = useState(false);

    // Cargar datos necesarios para los selects y sus funciones de carga
    const { productos, fetchProductos } = useProducts();
    const { tipos, fetchTipos } = useTipoAjuste();
    const { usuarios, fetchUsuarios } = useUsuarios();

    // Efecto: Cargar las listas completas cuando se abre el modal
    useEffect(() => {
        if (open) {
            // Cargamos usuarios (pag 1, 100 items) para llenar el select
            fetchUsuarios(1, 100);
            
            // Cargamos productos (pag 1, 100 items) para llenar el select
            fetchProductos(1, 100);

            // Cargamos tipos de ajuste (si el hook lo soporta sin args o con args)
            fetchTipos(); 
            
            // Reseteamos el formulario
            setForm(initialForm);
        }
    }, [open]);

    // Calcular stock actual para mostrarlo como referencia
    // Usamos 'any' en el find para evitar bloqueos de tipo estricto si codProducto varía
    const selectedProduct = productos.find((p: any) => p.codProducto === form.productoId);
    const currentStock = selectedProduct ? Number(selectedProduct.existencias) : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: ["tipoAjusteId", "cantidad", "usuarioId"].includes(name) ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!form.productoId) return alert("Seleccione un producto");
        if (form.tipoAjusteId === 0) return alert("Seleccione un tipo de ajuste");
        if (form.usuarioId === 0) return alert("Seleccione el usuario responsable");
        if (form.cantidad <= 0) return alert("La cantidad debe ser mayor a 0");

        // Validación de stock para disminuciones
        if (form.accion === 'disminucion' && form.cantidad > currentStock) {
            return alert(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`);
        }

        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Registrar Ajuste</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                        <select
                            name="productoId"
                            value={form.productoId}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value="">Seleccione un producto...</option>
                            {/* Uso de 'any' para evitar conflictos de tipos */}
                            {productos.map((p: any) => (
                                <option key={p.codProducto} value={p.codProducto}>
                                    {p.producto} (Stock: {p.existencias})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grid: Tipo y Usuario */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                            <select
                                name="tipoAjusteId"
                                value={form.tipoAjusteId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                                <option value={0}>Seleccione...</option>
                                {/* Uso de 'any' */}
                                {tipos.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.tipoAjuste}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                            <select
                                name="usuarioId"
                                value={form.usuarioId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                                <option value={0}>Seleccione...</option>
                                {/* FILTRO: Solo mostramos usuarios con rolId === 1 (Admins) */}
                                {usuarios
                                    .filter((u: any) => u.rolId === 1)
                                    .map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.email}</option>
                                    ))
                                }
                            </select>
                            {usuarios.length === 0 && (
                                <p className="text-xs text-orange-500 mt-1">Cargando lista...</p>
                            )}
                        </div>
                    </div>

                    {/* Grid: Acción y Cantidad */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
                            <select
                                name="accion"
                                value={form.accion}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 font-bold focus:outline-none ${
                                    form.accion === 'aumento' 
                                    ? 'text-green-700 border-green-300 bg-green-50' 
                                    : 'text-red-700 border-red-300 bg-red-50'
                                }`}
                            >
                                <option value="aumento">➕ AUMENTAR (Entrada)</option>
                                <option value="disminucion">➖ DISMINUIR (Salida)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                            <input
                                name="cantidad"
                                type="number"
                                min="1"
                                value={form.cantidad}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {form.productoId && (
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    Disponible: {currentStock}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Observación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                        <textarea
                            name="observacion"
                            value={form.observacion}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-20"
                            placeholder="Detalle la razón del ajuste..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded-lg shadow-sm disabled:opacity-50 transition-colors ${
                                form.accion === 'aumento' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {loading ? "Procesando..." : "Aplicar Ajuste"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}