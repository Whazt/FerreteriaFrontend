import { Routes, Route } from 'react-router-dom';
import SidebarAdmin from '../components/sidebarAdmin';
import AdminProductos from './adminPages/products';
import AdminUsuarios from './adminPages/user';

export function AdminPanel() {
    return (
        <div className="flex">
        <SidebarAdmin />
        <div className="grow ml-[10vh] lg:ml-[30vh]">
            <Routes>
                <Route path="/" element={<AdminProductos/>} />
                <Route path="Usuarios" element={<AdminUsuarios/>} />
                {/* <Route path="Usuarios" element={<GestionUsuarios />} />
                <Route path="Ventas" element={<GestionVentas />} /> */}
            </Routes>
        </div>
        </div>
    );
}