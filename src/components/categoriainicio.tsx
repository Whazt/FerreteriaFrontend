import { useNavigate } from 'react-router-dom';

// Tipado para cada categoría
interface Category {
  id: number;
  label: string;
  icon: string;
  alt: string;
}

const CategoriesGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCategory = (cat: number) => {
    navigate(`/Catalogo?categoriaId=${cat}&page=1`);
  };

  // Array de configuración para no repetir código HTML
  const categories: Category[] = [
    { id: 6, label: 'Herramientas Manuales', icon: '/hammer.svg', alt: 'Martillo' },
    { id: 5, label: 'Herramientas Eléctricas', icon: '/drill.svg', alt: 'Taladro' },
    { id: 7, label: 'Pintura y Acabados', icon: '/paint.svg', alt: 'Pintura' },
    { id: 4, label: 'Fontanería', icon: '/plumb.svg', alt: 'Fontanería' },
    { id: 2, label: 'Construcción', icon: '/wall.svg', alt: 'Construcción' },
  ];

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold mt-8 mb-4">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="text-center group">
            <button
              onClick={() => handleCategory(cat.id)}
              className="rounded-full p-4 border-2 border-orange-400 hover:bg-orange-50 transition-colors duration-200 bg-white"
            >
              <img src={cat.icon} alt={cat.alt} className="w-12 h-12 object-contain" />
            </button>
            <p className="text-orange-400 mt-2 font-medium group-hover:text-orange-600">
              {cat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;