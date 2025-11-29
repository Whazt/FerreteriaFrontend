import { Routes, Route } from 'react-router-dom';
import SidebarAdmin from '../components/sidebarAdmin';
import AdminProductos from './adminPages/products';
import AdminUsuarios from './adminPages/user';
import AdminTipoAjuste from './adminPages/tipoajuste';
import CategoriasPage from './adminPages/categoria'; 
import AdminClientes from './adminPages/cliente';
import AdminProveedores from './adminPages/proveedor';
import ComprasPage from './adminPages/compra';
import AjustesPage from './adminPages/ajuste';
import PedidosPage from './adminPages/perdido';

export function AdminPanel() {
    return (
        <div className="flex">
            <SidebarAdmin />
            <div className="grow ml-[10vh] lg:ml-[30vh]">
                <Routes>
                    <Route path="/" element={<PedidosPage/>} /> 
                    <Route path="Usuarios" element={<AdminUsuarios/>} />
                    <Route path="TipoAjuste" element={<AdminTipoAjuste/>} />
                    <Route path="Categoria" element={<CategoriasPage/>} />
                    <Route path="Productos" element={<AdminProductos/>} /> 
                    <Route path="Clientes" element={<AdminClientes/>} />
                    <Route path="Compra" element={<ComprasPage/>} />
                    <Route path="Compra" element={<ComprasPage/>} />
                    <Route path="Ajuste" element={<AjustesPage/>} />
                    <Route path="Proveedores" element={<AdminProveedores/>} />
                </Routes>
            </div>
        </div>
    );
}