import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import LoginModal from "./loginModal";
import RegisterModal from "./registerModal";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function AuthButton() {
    const { user, logout } = useAuthStore();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 🔹 Cierra el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) {
        return (
        <>
            <button
            onClick={() => setShowLogin(true)}
            className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
            >
            Iniciar sesión
            </button>
            {showLogin && (
            <LoginModal
                onClose={() => setShowLogin(false)}
                onRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
                }}
            />
            )}
            {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
        </>
        );
    }

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
        <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-orange-400 text-white gap px-4 py-3 rounded-md hover:bg-orange-500 flex items-center justify-center"
        >
            <FaUser className="text-lg" />
        </button>
        {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50">
            <button
                onClick={() => {
                logout();
                setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
                Cerrar sesión
            </button>
            {user.rol === 1 && (
                <NavLink
                to="/admin"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
                >
                Panel de administración
                </NavLink>
            )}
            </div>
        )}
        </div>
    );
}
