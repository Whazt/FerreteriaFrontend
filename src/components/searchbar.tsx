import { NavLink } from "react-router-dom";

export function SearchBar() {

    return (
        <form className=" ml-3 col-span-5 flex items-center space-x-2">
            <input 
            type="text" 
            placeholder="Buscar..." 
            
            className="flex-1 p-2 pl-4 text-slate-950 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" 
            />
            <NavLink to={"/"} className="p-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">
                Buscar
            </NavLink>
            
        </form>
    )
}