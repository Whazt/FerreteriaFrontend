import React, { useEffect, useState } from "react";
import MainCarousel from "../components/carrusel";
import CategoriesGrid from "../components/categoriainicio";
import SpecialOffers from "../components/ofertas";
import FeaturedProducts from "../components/prodestacados";
import { productService } from "../services/productService";
import type { Product } from "../types/product";

const Inicio: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getCatalogo(1, 10); 
        // Traemos 10 productos, puedes ajustar el límite
        setProducts(response.data.slice(0, 5)); 
        // Seleccionamos algunos (ej. 5 primeros) para destacados
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* Carrusel principal */}
      <MainCarousel />

      {/* Categorías */}
      <CategoriesGrid />

      {/* Ofertas especiales */}
      <SpecialOffers />

      {/* Productos destacados */}
      {loading && <p className="text-center mt-6">Cargando productos...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
      {!loading && !error && products.length > 0 && (
        <FeaturedProducts products={products} />
      )}
    </div>
  );
};

export default Inicio;