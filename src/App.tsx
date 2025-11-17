import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import { AdminPanel } from './pages/adminPanel';
import { CatalogoPage } from './pages/catalogo';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';

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
        </Routes>
      </div>
    </div>
  );
}

export default App;
