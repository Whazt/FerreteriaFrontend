import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-8 border-gray-900 justify-items-center text-black p-4">
      
      <div className="col-span-1 flex flex-col items-center justify-center text-center">
        <NavLink to="/Contact"><strong className="text-orange-500"> Contactenos </strong></NavLink>
        
        <br />
        <div className="text-left">
            <span className="text-orange-500">Teléfono: <span className="text-black"> 2256-7485</span></span>
            <br />
            <span className="text-orange-500   ">Correo: <span className="text-black"> salomonferreteria@gmail.com </span></span>
            <br />
            <p>De los semáforos del Conchita Palacios, 3 cuadras abajo, 1/2 al lago.</p>
        </div>
        
      </div>

      <div className="col-span-1 text-center">
        <strong className="text-orange-500"> Redes Sociales </strong>
        <br />
        <div className="flex items-center justify-center top-3">
            <img src="/whatsapp-tile.svg" alt="whatsapp" className="w-10 h-10 m-2" />
            <img src="/facebook-tile.svg" alt="facebook" className="w-10 h-10 m-2" />
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-center justify-center">
        <strong className="text-orange-500"> Nosotros </strong>
        <img src="/salomonlogo.png" alt="Salomon Logo" className="p-2 col-span-1"/>
      </div>

    </div>
  );
};

export default Footer;