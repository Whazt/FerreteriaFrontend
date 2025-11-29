import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Navega con query param
        navigate(`/Catalogo?search=${encodeURIComponent(search)}`);
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="ml-3 col-span-5 flex items-center space-x-2"
        >
            <input 
                type="text" 
                placeholder="Buscar..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-2 pl-4 text-slate-950 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" 
            />
            <button 
                type="submit" 
                className="p-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
            >
                Buscar
            </button>
        </form>
    );
}
