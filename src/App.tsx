import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import { AdminPanel } from './pages/adminPanel';
import { CatalogoPage } from './pages/catalogo';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import ProductoPage from './pages/productPage';
import { Carrito } from './pages/carrito';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/Admin-Panel");
  const { loadCart } = useCartStore();

  useEffect(() => {
    // hidrata carrito desde backend o localStorage
    loadCart();
  }, [loadCart]);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="grow">
        <Routes>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/Catalogo" element={<CatalogoPage />} />
          <Route path="/Admin-Panel/*" element={<AdminPanel />} />
          <Route path="/Producto/:id" element={<ProductoPage />} />
          <Route path="/Carrito" element={<Carrito />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
