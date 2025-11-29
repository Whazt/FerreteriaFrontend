import { NavLink } from 'react-router-dom';
import { 
    UsersGestIcon, 
    VentasIcon, 
    ProductIcon, 
    LogoutIcon,
    ClientIcon,     // Nuevo
    ProviderIcon,   // Nuevo
    PurchaseIcon,   // Nuevo
    AdjustmentIcon, // Nuevo
    TypeIcon,       // Nuevo
    CategoryIcon    // Nuevo
} from './icons';
import { useAuthStore } from "../store/useAuthStore";

const SidebarAdmin = () => {
    const { logout } = useAuthStore();
    
    // Clases base para mantener el código limpio
    const baseLinkClass = "m-1 py-4 px-6 rounded-lg flex gap-2 justify-center md:justify-start transition-colors";
    const activeClass = `${baseLinkClass} bg-orange-400 text-white`;
    const inactiveClass = `${baseLinkClass} hover:bg-orange-500 hover:text-white`;

    return (
        <div className="h-screen w-[10vh] md:w-[30vh] bg-white text-black flex fixed flex-col justify-between border-r border-gray-300">
            
            {/* SECCIÓN SCROLLABLE */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <div className="flex items-center justify-center h-20 bg-white mb-4 shrink-0">
                    <img src="/salomonlogo.png" alt="Salomon Logo" className="p-2 mt-4 w-full md:w-auto object-contain" />
                </div>
                
                <nav className="flex flex-col pb-4">
                    {/* PEDIDOS */}
                    <NavLink
                        to="/Admin-Panel"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                        end
                    >
                        <VentasIcon />
                        <span className="hidden md:block">Pedidos</span>
                    </NavLink>

                    {/* USUARIOS */}
                    <NavLink
                        to="/Admin-Panel/Usuarios"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <UsersGestIcon />
                        <span className="hidden md:block">Usuarios</span>
                    </NavLink>

                    {/* CLIENTES */}
                    <NavLink
                        to="/Admin-Panel/Clientes"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <ClientIcon />
                        <span className="hidden md:block">Clientes</span>
                    </NavLink>

                    {/* PRODUCTOS */}
                    <NavLink
                        to="/Admin-Panel/Productos"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                        end
                    >
                        <ProductIcon />
                        <span className="hidden md:block">Productos</span>
                    </NavLink>

                    {/* PROVEEDORES */}
                    <NavLink
                        to="/Admin-Panel/Proveedores"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <ProviderIcon />
                        <span className="hidden md:block">Proveedores</span>
                    </NavLink>

                    {/* COMPRAS */}
                    <NavLink
                        to="/Admin-Panel/Compra"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <PurchaseIcon />
                        <span className="hidden md:block">Compras</span>
                    </NavLink>

                    {/* AJUSTES */}
                    <NavLink
                        to="/Admin-Panel/Ajuste"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <AdjustmentIcon />
                        <span className="hidden md:block">Ajustes</span>
                    </NavLink>

                    {/* TIPO AJUSTE */}
                    <NavLink
                        to="/Admin-Panel/TipoAjuste"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <TypeIcon />
                        <span className="hidden md:block">Tipo Ajuste</span>
                    </NavLink>

                    {/* CATEGORÍAS */}
                    <NavLink
                        to="/Admin-Panel/Categoria"
                        className={({ isActive }) => isActive ? activeClass : inactiveClass}
                    >
                        <CategoryIcon />
                        <span className="hidden md:block">Categorías</span>
                    </NavLink>
                </nav>
            </div>

            {/* SECCIÓN FIJA: LOGOUT */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 z-10">
                <button
                    className="w-full gap-2 flex py-2 items-center justify-center bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded transition-colors"
                    onClick={() => logout()}
                >
                    <LogoutIcon />
                    <span className="hidden md:block">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;