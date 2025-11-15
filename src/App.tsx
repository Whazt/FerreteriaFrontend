import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import Nosotros from './pages/nosotros';
import Inicio from './pages/inicio';
import Products from './pages/categories';
import { AdminPanel } from './pages/adminPanel';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/Admin-Panel";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Categorias" element={<Products />} />
          <Route path="/Admin-Panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
