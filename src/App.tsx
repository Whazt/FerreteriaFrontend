import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import Nosotros from './pages/nosotros';
import Inicio from './pages/inicio';
import Products from './pages/categories';

function App() {
  return (

    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <div className="grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Categorias" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
