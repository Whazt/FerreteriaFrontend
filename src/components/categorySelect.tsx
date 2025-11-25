import { useEffect, useState } from "react";

interface Categoria {
    id: string;
    categoria: string;
}

interface CategorySelectProps {
    value?: string;
    onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.VITE_API_URL}/categorias`;
        fetch(url)
            .then((res) => {
            if (!res.ok) throw new Error("Error al cargar categorías");
            return res.json();
            })
            .then((json) => {
            const data = Array.isArray(json) ? json : json.data;
            setCategorias(data ?? []);
            })
            .catch((err) => {
            console.error("Error cargando categorías:", err);
            setCategorias([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando categorías...</p>;

    return (
        <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg"
        >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.categoria}
                </option>
            ))}
        </select>
        
    );
    
}
