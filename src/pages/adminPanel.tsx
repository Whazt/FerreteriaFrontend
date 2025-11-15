import { Routes, Route } from 'react-router-dom';
import SidebarAdmin from '../components/sidebarAdmin';
import AdminProductos from './adminPages/products';
import AdminUsuarios from './adminPages/user';
import AdminTipoAjuste from './adminPages/tipoajuste';
import AdminDepartamentos from './adminPages/departamento';
import AdminMunicipios from './adminPages/municipio';
import AdminClientes from './adminPages/cliente';
import AdminProveedores from './adminPages/proveedor';

export function AdminPanel() {
    return (
        <div className="flex">
        <SidebarAdmin />
        <div className="grow ml-[10vh] lg:ml-[30vh]">
            <Routes>
                <Route path="/" element={<AdminProductos/>} />
                <Route path="Usuarios" element={<AdminUsuarios/>} />
                <Route path="TipoAjuste" element={<AdminTipoAjuste/>} />
                <Route path="Departamentos" element={<AdminDepartamentos/>} />
                <Route path="Municipios" element={<AdminMunicipios/>} />
                <Route path="Clientes" element={<AdminClientes/>} />
                <Route path="Proveedores" element={<AdminProveedores/>} />
                {/* <Route path="Usuarios" element={<GestionUsuarios />} />
                <Route path="Ventas" element={<GestionVentas />} /> */}
            </Routes>
        </div>
        </div>
    );
}