import React from 'react';

interface ContactCardProps {
  mapSrc: string;        // URL del embed de Google Maps
  address: string;       // Texto de la dirección que va bajo el mapa
  children: React.ReactNode; // Aquí irá el Formulario y el Horario
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  mapSrc,
  address,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden w-full mb-8 border border-gray-100 ${className}`}>
      
      <div className="flex flex-col md:flex-row min-h-[600px]">
        
        <div className="w-full md:w-1/2 bg-gray-100 relative flex flex-col">
          <div className="flex-1 relative min-h-[300px]">
            <iframe 
              title="Ubicación Mapa"
              src={mapSrc} 
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="p-4 bg-white border-t border-gray-200 z-10 relative">
            <p className="text-gray-700 text-center md:text-left text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-2">
              <span className="text-orange-500 text-xl">📍</span> {address}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {children}
        </div>

      </div>
    </div>
  );
};