import { useState, useEffect } from 'react';

const MainCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Array de imágenes (banners)
  const banners = [
    "/banner1.jpg",
    "/banner2.png",
    "/banner3.png"
  ];

  // Lógica de Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Cambio cada 5 segundos

    return () => clearInterval(interval); // Limpieza al desmontar
  }, [banners.length]);

  // Funciones para navegación manual (opcional, pero útil)
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden m-0 p-0 group">
      {/* Contenedor de Imágenes */}
      <div 
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              src={banner} 
              alt={`Banner ${index + 1}`} 
              className="w-full h-64 md:h-96 object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Indicadores (Puntos) en la parte inferior */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? 'bg-orange-500 scale-110' : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Botones de navegación (Anterior/Siguiente) visibles al hacer hover */}
      <button 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={() => setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)}
      >
        &#10094;
      </button>
      <button 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={() => setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)}
      >
        &#10095;
      </button>
    </div>
  );
};

export default MainCarousel;