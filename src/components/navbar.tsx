// import { Cart } from "./cart";
//import Login from "./login";
import { SearchBar } from "./searchbar";
import { NavLink } from "react-router-dom";
import React from "react";

export const Navbar: React.FC = () => {
    return (
        <>
        <nav className="grid grid-cols-1 md:grid-cols-8 items-center min-h-[20vh] w-full z-10">
            <div className="col-span-1 md:col-span-1 text-center md:text-left">
                <img
                    src="/salomonlogo.png"
                    alt="Salomon Logo"
                    className="p-2 mx-auto block"
                />
            </div>
            <div className="col-span-1 md:col-span-5 hidden md:block">
                <SearchBar />
            </div>
            {/* <div className="col-span-1 md:col-span-1 text-center md:text-left">
                <Login />
            </div> */}
            {/* <div className="col-span-1 md:col-span-1 text-center md:text-left">
                <Cart />
            </div> */}
            <div className="col-span-8 md:col-span-8 flex flex-wrap gap-2 items-center justify-center bg-orange-400 p-2 mt-2 md:mt-0 w-full">
                <NavLink
                    to="/"
                    className="p-2 text-white rounded-md hover:bg-orange-500"
                >
                    INICIO
                </NavLink>
                <NavLink
                    to="/Nosotros"
                    className="p-2 text-white rounded-md hover:bg-orange-500"
                >
                    NOSOTROS
                </NavLink>
                <NavLink
                    to="/Categorias"
                    className="p-2 text-white rounded-md hover:bg-orange-500 uppercase"
                >
                    CATEGORÍAS
                </NavLink>
            </div>
        </nav>
        </>
    );
};
