import { ContactCard } from '../components/contactCard'; 

export const ContactoPage = () => {
  const mapUrl = "https://maps.google.com/maps?q=4QJF%2BXR8%2C+Managua&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 font-sans">
      
      <ContactCard 
        mapSrc={mapUrl}
        address="De los semáforos del Conchita Palacios, 3 cuadras abajo, 1/2 al lago."
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Horario De Atención:
          </h2>
          <div className="text-gray-600 space-y-1">
            <p>Lunes a Viernes</p>
            <p className="font-semibold text-gray-800 text-lg">8am a 5pm</p>
            <div className="h-2"></div> 
            <p>Sábados a Domingos</p>
            <p className="font-semibold text-gray-800 text-lg">8am a 12md</p>
          </div>
        </div>

        <form className="space-y-5">
          <InputGroup label="Nombre:" id="nombre" placeholder="Ej: Alberto Murillo" />
          <InputGroup label="Correo:" id="correo" type="email" placeholder="Ej: ejemplo@eje.com" />
          
          <div>
            <label htmlFor="mensaje" className="block text-gray-700 font-medium mb-1">Mensaje:</label>
            <textarea 
              id="mensaje"
              rows={3}
              placeholder="Ej: Quiero Consultar Sobre..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="button" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md shadow-md transform hover:scale-[1.02] transition-all duration-300"
          >
            Enviar
          </button>
        </form>

      </ContactCard>
    </div>
  );
};

const InputGroup = ({ label, id, type = "text", placeholder }: { label: string, id: string, type?: string, placeholder: string }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 font-medium mb-1">{label}</label>
    <input 
      type={type} 
      id={id}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
    />
  </div>
);