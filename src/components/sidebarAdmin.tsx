import { NavLink } from 'react-router-dom';
import { UsersGestIcon, VentasIcon, ProductIcon, LogoutIcon } from './icons';

const SidebarAdmin = () => {

    return (
        <div className="h-screen w-[10vh] md:w-[30vh] bg-white text-black flex fixed flex-col justify-between border-r border-gray-300">
            
            {/* SECCIÓN SCROLLABLE: Ocupa todo el espacio disponible (flex-1) y permite scroll (overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <div className="flex items-center justify-center h-20 bg-white mb-4 shrink-0">
                    <img src="/salomonlogo.png" alt="Salomon Logo" className="p-2 mt-4 w-full md:w-auto object-contain" />
                </div>
                
                <nav className="flex flex-col pb-4">
                    <NavLink
                        to="/Admin-Panel"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                        end
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Pedidos</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Usuarios"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <UsersGestIcon />
                        <span className="hidden md:block">Usuarios</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Clientes"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Clientes</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Productos"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                        end
                    >
                        <ProductIcon />
                        <span className="hidden md:block">Productos</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Proveedores"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Proveedores</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Compra"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Compras</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Ajuste"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Ajustes</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/TipoAjuste"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">TipoAjuste</span>
                    </NavLink>
                    <NavLink
                        to="/Admin-Panel/Categoria"
                        className={({ isActive }) =>
                            isActive
                                ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                                : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start transition-colors"
                        }
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Categorías</span>
                    </NavLink>
                </nav>
            </div>

            {/* SECCIÓN FIJA: Botón de Logout siempre visible abajo */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 z-10">
                <button
                    className="w-full gap-2 flex py-2 items-center justify-center bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded transition-colors"
                >
                    <LogoutIcon />
                    <span className="hidden md:block">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;