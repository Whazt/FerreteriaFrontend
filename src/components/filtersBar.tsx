import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategorySelect } from "./categorySelect";

export function FiltersBar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialPrecioMin = searchParams.get("precioMin") ?? "0";
    const initialPrecioMax = searchParams.get("precioMax") ?? "10000";
    const initialCategoriaId = searchParams.get("categoriaId") ?? "";

    const [precioMin, setPrecioMin] = useState(initialPrecioMin);
    const [precioMax, setPrecioMax] = useState(initialPrecioMax);
    const [categoriaId, setCategoriaId] = useState(initialCategoriaId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const min = Number(precioMin);
        const max = Number(precioMax);

        // 🔹 Validación dura: coherencia
        if (min > max) return;

        const params = new URLSearchParams(searchParams);

        if (precioMin) params.set("precioMin", precioMin);
        else params.delete("precioMin");

        if (precioMax) params.set("precioMax", precioMax);
        else params.delete("precioMax");

        if (categoriaId) params.set("categoriaId", categoriaId);
        else params.delete("categoriaId");

        // 🔹 Reiniciar siempre a la página 1 al aplicar filtros
        params.set("page", "1");

        navigate(`/Catalogo?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 p-4 rounded-md"
        >
            {/* 🔹 Slider mínimo */}
            <div className="flex flex-col w-full sm:w-1/3">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                    Precio mínimo: {precioMin}
                </label>
                <div className="w-full p-2 border border-gray-300 rounded-lg">
                    <input
                    type="range"
                    min="0"
                    max="1000"
                    step="5"
                    value={precioMin}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= Number(precioMax)) setPrecioMin(String(val));
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>

            {/* 🔹 Slider máximo */}
            <div className="flex flex-col w-full sm:w-1/3">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                    Precio máximo: {precioMax}
                </label>
                <div className="w-full p-2 border border-gray-300 rounded-lg">
                    <input
                        type="range"
                        min="0" 
                        max="1000"
                        step="5"
                        value={precioMax}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= Number(precioMin)) setPrecioMax(String(val));
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>

            {/* 🔹 Categoría */}
            <div className="flex flex-col w-full sm:w-1/3">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                    Categoría
                </label>
                <CategorySelect value={categoriaId} onChange={setCategoriaId} />
            </div>

            <button
                type="submit"
                className="p-2 mt-6 bg-orange-400 text-white rounded-md hover:bg-orange-500 w-full sm:w-auto"
            >
                Filtrar
            </button>
        </form>
    );
}
