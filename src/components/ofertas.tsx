import { NavLink } from 'react-router-dom';

const SpecialOffers = () => {
  return (
    <div className="bg-orange-400 text-white text-center py-8 mt-8 w-full">
      <h2 className="text-3xl font-bold mb-2">¡Ofertas Especiales!</h2>
      <p className='mb-6 text-lg'>No te pierdas nuestras promociones exclusivas de temporada</p>
      <NavLink 
        to="/Catalogo" 
        className="bg-white text-orange-400 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-md"
      >
        Comprar Ahora
      </NavLink>
    </div>
  );
};

export default SpecialOffers;