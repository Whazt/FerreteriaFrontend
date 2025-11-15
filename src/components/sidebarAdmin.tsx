import { NavLink } from 'react-router-dom';
import { UsersGestIcon, VentasIcon, ProductIcon, LogoutIcon } from './icons';

const SidebarAdmin = () => {

    return (
        <div className="h-screen w-[10vh] md:w-[30vh] bg-white text-black flex fixed flex-col justify-between border-r border-gray-300">
        <div>
            <div className="flex items-center justify-center h-20 bg-white mb-10">
            <img src="/salomonlogo.png" alt="Salomon Logo" className="p-2 mt-4 w-full md:w-auto" />
            </div>
            <nav className="flex flex-col mt-4">
                <NavLink
                    to="/Admin-Panel"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                    end
                >
                    <ProductIcon />
                    <span className="hidden md:block">Productos</span>
                </NavLink>
                <NavLink
                    to="/Admin-Panel/Usuarios"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <UsersGestIcon />
                    <span className="hidden md:block">Usuarios</span>
                </NavLink>
                {/* <NavLink
                    to="/Admin-Panel/Roles"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">Roles</span>
                </NavLink> */}
                <NavLink
                    to="/Admin-Panel/TipoAjuste"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">TipoAjuste</span>
                </NavLink>
                <NavLink
                    to="/Admin-Panel/Departamentos"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">Departamentos</span>
                </NavLink>
                <NavLink
                    to="/Admin-Panel/Municipios"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">Municipios</span>
                </NavLink>
                <NavLink
                    to="/Admin-Panel/Clientes"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">Clientes</span>
                </NavLink>
                <NavLink
                    to="/Admin-Panel/Proveedores"
                    className={({ isActive }) =>
                    isActive
                        ? "m-1 py-4 px-6 bg-orange-400 text-white rounded-lg flex gap-2 justify-center md:justify-start"
                        : "m-1 py-4 px-6 hover:bg-orange-500 hover:text-white rounded-lg flex gap-2 justify-center md:justify-start"
                    }
                >
                    <VentasIcon />
                    <span className="hidden md:block">Proveedores</span>
                </NavLink>
            </nav>
        </div>
        <div className="p-4">
            <button
            className="w-full gap-2 flex py-2 items-center justify-center bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded"
            >
            <LogoutIcon />
            <span className="hidden md:block">Logout</span>
            </button>
        </div>
        </div>
    );
};

export default SidebarAdmin;