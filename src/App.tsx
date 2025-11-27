import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import { AdminPanel } from './pages/adminPanel';
import { CatalogoPage } from './pages/catalogo';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import ProductoPage from './pages/productPage';
import { Carrito } from './pages/carrito';
import { useAuthStore } from './store/useAuthStore';
import AppCartSync from './components/appCartSync';
import { NosotrosPage } from './pages/nosotros';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/Admin-Panel");
  const hideFooter = location.pathname.startsWith("/Admin-Panel");
  const { loadCart } = useCartStore();
  const { accessToken, setUserFromToken } = useAuthStore();

  useEffect(() => {
    // hidrata carrito desde backend o localStorage
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (accessToken) {
      setUserFromToken(accessToken);
    }
  }, [accessToken, setUserFromToken]);
  return (
    <div className="min-h-screen flex flex-col">
      <AppCartSync/>
      {!hideNavbar && <Navbar />}
      <div className="grow">
        <Routes>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/Catalogo" element={<CatalogoPage />} />
          <Route path="/Nosotros" element={<NosotrosPage />} />
          <Route path="/Admin-Panel/*" element={<AdminPanel />} />
          <Route path="/Producto/:id" element={<ProductoPage />} />
          <Route path="/Carrito" element={<Carrito />} />
        </Routes>
      </div>
      {/* {!hideFooter && <Footer/>} */}
    </div>
  );
}

export default App;
