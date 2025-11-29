import { InfoNoss } from '../components/InfoNoss';

export const NosotrosPage = () => {
  return (
    // 'max-w-7xl mx-auto' centra el contenido en pantallas muy grandes
    // 'px-4' agrega margen a los lados en móviles
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* SECCIÓN 1: ¿Quiénes Somos? */}
      <InfoNoss 
        title="¿Quiénes Somos?"
        imgSrc="/quienes_somos.jpg"
        imgAlt="Nuestro equipo en el pasillo de la ferretería"
      >
        <p>
          Somos un equipo comprometido con la excelencia y la satisfacción del cliente. 
          Desde nuestro inicio, nos hemos dedicado a proporcionar productos de calidad, 
          asesoramiento experto y un servicio excepcional. Nos consideramos no solo proveedores, 
          sino también socios en la realización de tus proyectos, ya sean pequeños trabajos 
          de bricolaje o grandes construcciones.
        </p>
      </InfoNoss>

      {/* SECCIÓN 2: Misión (Imagen a la izquierda) */}
      <InfoNoss 
        title="Misión"
        imgSrc="/mision.jpg"
        imgAlt="Herramientas de construcción sobre una mesa"
        imageLeft={true}
      >
        <p>
          Proporcionar a nuestros clientes soluciones integrales para sus necesidades de 
          construcción, reparación y mantenimiento. Ofrecemos productos de calidad y un 
          asesoramiento experto que supera expectativas. Nos esforzamos por ser el socio 
          de confianza de cada cliente, brindando atención personalizada.
        </p>
      </InfoNoss>

      {/* SECCIÓN 3: Visión */}
      <InfoNoss 
        title="Visión"
        imgSrc="/vision.jpg"
        imgAlt="Vista moderna de construcción sostenible"
      >
        <p>
          Convertirnos en la ferretería de referencia en nuestra comunidad y más allá, 
          reconocida por nuestra excelencia, servicio al cliente y compromiso con la 
          sostenibilidad. Aspiramos a ser líderes en innovación, adaptándonos continuamente 
          a las necesidades cambiantes del mercado.
        </p>
      </InfoNoss>

      {/* SECCIÓN 4: Valores (Imagen a la izquierda) */}
      <InfoNoss 
        title="Valores"
        imgSrc="/valores.jpg"
        imgAlt="Manos trabajando juntas con herramientas"
        imageLeft={true}
      >
        <ul className="list-decimal list-inside space-y-2 font-medium text-lg ml-2">
          <li><strong>Calidad:</strong> Productos garantizados.</li>
          <li><strong>Integridad:</strong> Honestidad en cada trato.</li>
          <li><strong>Compromiso:</strong> Con tu satisfacción.</li>
          <li><strong>Colaboración:</strong> Trabajamos contigo.</li>
          <li><strong>Responsabilidad:</strong> Con el medio ambiente.</li>
        </ul>
      </InfoNoss>

    </div>
  );
};