import React, { useState } from "react";
import { SearchBar } from "./searchbar";
import { NavLink } from "react-router-dom";
import { Cart } from "./cart";
import AuthButton from "./authButton";

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
            {/* --- TOP BAR: Logo, Buscador Desktop, Iconos --- */}
            {/* Aumentamos el padding vertical (py-4) para que la barra sea más alta */}
            <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
                
                {/* 1. LOGO */}
                <div className="shrink-0">
                    <img
                        src="/salomonlogo.png"
                        alt="Salomon Logo"
                        // Aumentamos el tamaño del logo en móviles (h-14) y escritorio (h-20)
                        className="h-14 md:h-20 w-auto object-contain"
                    />
                </div>

                {/* 2. BUSCADOR (Solo Desktop) */}
                <div className="hidden md:flex flex-1 mx-6 lg:mx-12 h-12 items-center">
                    <div className="w-full">
                        <SearchBar />
                    </div>
                </div>

                {/* 3. ICONOS Y ACCIONES (Derecha) */}
                <div className="flex items-center gap-3 md:gap-6">
                    
                    {/* Botón Lupa (Solo Móvil) */}
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* Auth Button */}
                    <div className="hidden md:block">
                        <AuthButton />
                    </div>
                    
                    {/* Carrito - CORRECCIÓN: Eliminamos 'transform' para no romper el sidebar fixed */}
                    <div>
                        <Cart />
                    </div>

                    {/* Botón Menú Hamburguesa (Solo Móvil) */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors focus:outline-none"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* --- BUSCADOR MÓVIL (Desplegable) --- */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-24 opacity-100 py-4 px-4 bg-gray-50 border-t shadow-inner' : 'max-h-0 opacity-0'}`}>
                <SearchBar />
            </div>

            {/* --- BARRA DE NAVEGACIÓN (Naranja) --- */}
            <div className={`
                bg-orange-400 text-white md:block transition-all duration-300 ease-in-out shadow-inner
                ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 md:max-h-full opacity-0 md:opacity-100 overflow-hidden'}
            `}>
                <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-4 py-4 md:py-3 text-base font-bold tracking-wide uppercase">
                    
                    <div className="md:hidden w-full flex justify-center pb-4 border-b border-orange-300 mb-2">
                        <AuthButton />
                    </div>

                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `px-6 py-2 rounded-full transition-all duration-200 hover:bg-orange-500 hover:shadow-lg ${isActive ? 'bg-orange-600 shadow-md' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Inicio
                    </NavLink>
                    <NavLink 
                        to="/Nosotros" 
                        className={({ isActive }) => `px-6 py-2 rounded-full transition-all duration-200 hover:bg-orange-500 hover:shadow-lg ${isActive ? 'bg-orange-600 shadow-md' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Nosotros
                    </NavLink>
                    <NavLink 
                        to="/Catalogo" 
                        className={({ isActive }) => `px-6 py-2 rounded-full transition-all duration-200 hover:bg-orange-500 hover:shadow-lg ${isActive ? 'bg-orange-600 shadow-md' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Catálogo
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};