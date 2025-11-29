import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/navbar";
import { AdminPanel } from './pages/adminPanel';
import { CatalogoPage } from './pages/catalogo';
import { useEffect, useState } from 'react'; // Agregamos useState
import { useCartStore } from './store/useCartStore';
import ProductoPage from './pages/productPage';
import { Carrito } from './pages/carrito';
import { useAuthStore } from './store/useAuthStore';
import AppCartSync from './components/appCartSync';
import { NosotrosPage } from './pages/nosotros';
import Footer from "./components/footer";
import Inicio from "./pages/inicio";
import { ProtectedRoute } from './components/protectedRoutes';
import { jwtDecode } from 'jwt-decode';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/Admin-Panel");
  const hideFooter = location.pathname.startsWith("/Admin-Panel");
  
  const { loadCart } = useCartStore();
  const { accessToken, setUserFromToken, refreshAccessToken } = useAuthStore();
  
  // Estado para bloquear la carga de la app hasta verificar la sesión
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Helper para verificar si el token expiró
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // 1. Gestión de Sesión (Token Check & Refresh)
  useEffect(() => {
    const initAuth = async () => {
      // Si hay token guardado, verificamos su validez
      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          console.log("Token expirado detectado. Intentando refrescar...");
          try {
            await refreshAccessToken(); // Esperamos a que termine el refresh
          } catch (error) {
            console.log("No se pudo restaurar la sesión.");
          }
        } else {
          // Token válido: restauramos el usuario
          setUserFromToken(accessToken);
        }
      } else {
        // No hay token: intento silencioso por si hay cookie (opcional)
        try {
            await refreshAccessToken();
        } catch (error) {
            console.log("Usuario invitado");
        }
      }
      
      // UNA VEZ TERMINADO TODO EL PROCESO, DESBLOQUEAMOS LA APP
      setIsAuthChecking(false);
    };

    initAuth();
  }, []); // Se ejecuta solo una vez al montar

  // 2. Carga del carrito
  useEffect(() => {
    // Si estamos chequeando auth, no cargamos carrito todavía
    if (isAuthChecking) return;

    // Doble check de seguridad
    if (accessToken && isTokenExpired(accessToken)) return;

    loadCart();
  }, [loadCart, accessToken, isAuthChecking]);

  // PANTALLA DE CARGA INICIAL (Bloquea renderizado de hijos como AppCartSync)
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Iniciando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* AppCartSync ahora solo se monta cuando isAuthChecking es false */}
      <AppCartSync/>
      {!hideNavbar && <Navbar />}
      <div className="grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Catalogo" element={<CatalogoPage />} />
          <Route path="/Nosotros" element={<NosotrosPage />} />
          
          {/* Rutas Protegidas del Panel */}
          <Route 
            path="/Admin-Panel/*" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/Producto/:id" element={<ProductoPage />} />
          <Route path="/Carrito" element={<Carrito />} />
        </Routes>
      </div>
      {!hideFooter && <Footer/>}
    </div>
  );
}

export default App;