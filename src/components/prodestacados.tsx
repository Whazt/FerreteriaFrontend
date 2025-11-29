import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { Product } from "../types/product";

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < products.length - 3 ? prevIndex + 1 : products.length - 3
    );
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full px-4 mb-12">
      <h2 className="text-2xl font-bold mt-8 mb-6">Productos Destacados</h2>
      <div className="relative group">
        {/* Botón Anterior */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white p-3 rounded-full z-10 shadow-lg hover:bg-orange-500 transition-all ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
        >
          &lt;
        </button>

        {/* Contenedor de Productos */}
        <div className="flex overflow-hidden space-x-4 py-4">
          {products.slice(currentIndex, currentIndex + 3).map((product) => (
            <div
              key={product.codProducto}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 text-center p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.imagenUrl ?? "/placeholder.png"}
                alt={product.producto}
                className="mx-auto mb-4 h-48 object-contain"
              />
              <h3 className="font-bold mb-2 text-lg truncate px-2">
                {product.producto}
              </h3>
              <p className="text-gray-500 mb-4 text-sm line-clamp-2">
                {product.descripcion || "Producto de alta calidad"}
              </p>
              <p className="text-orange-500 font-semibold mb-2">
                ${product.precio.toFixed(2)}
              </p>
              <NavLink
                to={`/Producto/${product.codProducto}`}
                className="bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500 transition-colors inline-block"
              >
                Ver Detalles
              </NavLink>
            </div>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= products.length - 3}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white p-3 rounded-full z-10 shadow-lg hover:bg-orange-500 transition-all ${
            currentIndex >= products.length - 3
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
