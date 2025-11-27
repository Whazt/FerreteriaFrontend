//Componente para Nosotros
import React from 'react';

interface InfoNossProps {
  title: string;
  children: React.ReactNode;
  imgSrc: string;
  imgAlt: string;
  imageLeft?: boolean; // Si es true, la imagen aparece a la izquierda
  className?: string;  // Para agregar estilos extra si hace falta
}

export const InfoNoss: React.FC<InfoNossProps> = ({ 
  title, 
  children, 
  imgSrc, 
  imgAlt, 
  imageLeft = false,
  className = ""
}) => {
  return (
    <div className={`bg-orange-400 rounded-lg shadow-lg overflow-hidden text-white mb-8 transform hover:scale-[1.01] transition-transform duration-300 w-full ${className}`}>
      {/* CLAVES DE RESPONSIVIDAD:
         1. 'flex-col': En móviles, los elementos se apilan (imagen sobre/bajo texto).
         2. 'md:flex-row': En pantallas medianas (tablets/PC), se ponen lado a lado.
         3. 'md:flex-row-reverse': Si imageLeft es true, invierte el orden en escritorio.
      */}
      <div className={`flex flex-col md:flex-row ${imageLeft ? 'md:flex-row-reverse' : ''}`}>
        
        {/* CONTENIDO DE TEXTO */}
        {/* 'flex-1' hace que el texto ocupe todo el espacio disponible que deja la imagen */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b-2 border-white/30 pb-2 inline-block self-start">
            {title}
          </h2>
          <div className="text-white/90 text-lg leading-relaxed">
            {children}
          </div>
        </div>

        {/* IMAGEN */}
        {/* - 'w-full': Ancho completo en móvil.
           - 'md:w-2/5': En escritorio ocupa el 40% del ancho.
           - 'h-64': Altura fija en móvil para que no sea enorme.
           - 'md:h-auto': En escritorio la altura se adapta al contenido de texto.
        */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-white/10">
           <img 
            src={imgSrc} 
            alt={imgAlt}
            className="w-full h-full object-cover"
          /> 
          {/* Capa oscura sutil opcional para mejorar contraste si la imagen es muy clara */}
          <div className="absolute inset-0 bg-orange-900/10"></div>
        </div>

      </div>
    </div>
  );
};