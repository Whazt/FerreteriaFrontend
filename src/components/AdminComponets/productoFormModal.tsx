import { useState, useEffect } from "react";
import axios from "axios";
import type { Product, Categoria } from "../../types/product";
import { useCategorias } from "../../hooks/useCategoria";

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Product | null;
    onSubmit: (data: Omit<Product, "codProducto"> | Product) => void;
};

// Extendemos el tipo para el formulario local
interface ProductFormState extends Omit<Product, "codProducto"> {
    categoriaId: string;
}

const initialForm: ProductFormState = {
    producto: "",
    descripcion: "",
    precio: 0,
    existencias: 0,
    categoriaId: "", 
    categoria: { id: "", categoria: "", descripcion: "" }, 
    costo: 0,
    imagenUrl: "",
    existenciaMax: 0,
    existenciaMin: 0,
};

export default function ProductoFormModal({ open, onClose, initialData, onSubmit }: Props) {
    const [form, setForm] = useState<ProductFormState>(initialForm);
    const { categorias } = useCategorias();

    useEffect(() => {
        if (initialData) {
            const { codProducto, ...rest } = initialData;
            
            // Recuperación robusta del ID de categoría
            let catId = "";
            if (rest.categoria && rest.categoria.id) {
                catId = String(rest.categoria.id);
            } else if ((rest as any).categoriaId) {
                catId = String((rest as any).categoriaId);
            }

            setForm({
                ...rest,
                producto: rest.producto ?? "",
                descripcion: rest.descripcion ?? "",
                precio: Number(rest.precio) || 0,
                existencias: Number(rest.existencias) || 0,
                costo: Number(rest.costo) || 0,
                existenciaMax: Number(rest.existenciaMax) || 0,
                existenciaMin: Number(rest.existenciaMin) || 0,
                imagenUrl: rest.imagenUrl ?? "",
                categoriaId: catId,
                categoria: rest.categoria ?? { id: "", categoria: "", descripcion: "" },
            });
        } else {
            setForm(initialForm);
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: ["precio", "existencias", "costo", "existenciaMax", "existenciaMin"].includes(name)
                ? parseFloat(value) || 0
                : value,
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gsniom99");
        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dffityi8e/image/upload",
                formData
            );
            setForm((prev) => ({ ...prev, imagenUrl: response.data.secure_url }));
        } catch (err) {
            console.error("Error subiendo imagen:", err);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (form.existenciaMin > form.existenciaMax) {
            alert("La existencia mínima no puede ser mayor que la máxima.");
            return;
        }

        // VALIDACIÓN CONDICIONAL:
        // Solo obligamos a seleccionar categoría si estamos CREANDO un producto nuevo.
        // Si estamos editando (initialData existe), permitimos enviarlo vacío.
        if (!initialData && (!form.categoriaId || form.categoriaId === "")) {
            alert("Por favor seleccione una categoría.");
            return;
        }
        
        // Preparar payload para enviar
        const payload: any = { ...form };

        // Si es edición y el campo está vacío, lo eliminamos del objeto
        // para que Zod (en el backend) lo ignore y mantenga el valor anterior.
        if (initialData && (!payload.categoriaId || payload.categoriaId === "")) {
            delete payload.categoriaId;
        }

        onSubmit(payload);
        
        if (!initialData) setForm(initialForm);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/20 z-50 flex justify-center overflow-y-auto backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg my-10 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-orange-500">
                        {initialData ? "Editar Producto" : "Agregar Producto"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            name="producto"
                            value={form.producto ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            name="descripcion"
                            value={form.descripcion ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>

                    {/* SELECTOR DE CATEGORÍA (Opcional en edición) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Categoría {initialData && <span className="text-gray-400 font-normal text-xs">(Opcional)</span>}
                        </label>
                        <select
                            name="categoriaId"
                            value={String(form.categoriaId || "")} 
                            onChange={handleChange}
                            // Ya no usamos 'required' aquí, lo controlamos en handleSubmit
                            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white"
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((cat: any) => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.categoria}
                                </option>
                            ))}
                        </select>
                        {categorias.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">No se han cargado categorías.</p>
                        )}
                    </div>

                    {/* Precio y Costo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                name="precio"
                                type="number"
                                min={0}
                                step="0.01"
                                value={form.precio ?? 0}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Costo</label>
                            <input
                                name="costo"
                                type="number"
                                min={0}
                                step="0.01"
                                value={form.costo ?? 0}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Existencias */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Actual</label>
                            <input
                                name="existencias"
                                type="number"
                                min={0}
                                value={form.existencias ?? 0}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mínima</label>
                            <input
                                name="existenciaMin"
                                type="number"
                                min={0}
                                value={form.existenciaMin ?? 0}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Máxima</label>
                            <input
                                name="existenciaMax"
                                type="number"
                                min={0}
                                value={form.existenciaMax ?? 0}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                        {form.imagenUrl && (
                            <div className="mt-2 relative group w-24 h-24">
                                <img
                                    src={form.imagenUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-md border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors shadow-sm"
                        >
                            {initialData ? "Guardar Cambios" : "Guardar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}