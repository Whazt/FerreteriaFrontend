import { NavLink } from "react-router-dom";
import { ICartIcon, PlusIcon } from "./icons";

// 👉 Tipo del producto según tu modelo Sequelize
export interface Product {
    codProducto: string;
    producto: string;
    descripcion: string;
    precio: string;
    existencias: number;
    categoriaId: number;
    costo: string;
    imagenUrl: string;
    existenciaMax: number;
    existenciaMin: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// 👉 Props tipados
interface ListProductsProps {
    products: Product[] | Product;
}

export default function ListProducts({ products }: ListProductsProps) {
  // 🔒 Blindaje: si viene un solo producto como objeto, lo convertimos en array
    const productList = Array.isArray(products) ? products : [products];

    // 🔒 Si no hay productos, mostramos mensaje
    if (!productList || productList.length === 0) {
        return (
        <main className="bg-gray-50 py-10">
            <p className="text-center text-gray-500 text-lg">No hay productos disponibles.</p>
        </main>
        );
    }

    return (
        <main className="bg-gray-50">
        <ul className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-4 md:m-1 lg:m-10">
            {productList.map((product) => (
            <li key={`${product.codProducto}-${product.createdAt}`} className="col-span-1 min-h-[50%] m-2">
                <div className="w-full max-w-sm bg-white border border-t border-gray-800 rounded-lg shadow-xl">
                <NavLink to={`/Producto-Info/${product.codProducto}`}>
                    <img
                        className="py-3 px-6 rounded-t-lg"
                        src={product.imagenUrl}
                        alt={product.producto}
                        onError={(e) => {
                        e.currentTarget.src = "/pintura.jpg";
                        }}
                    />
                </NavLink>

                <div className="px-5 pb-5 border-t-2 border-gray-950 min-h-[118px]">
                    <NavLink to={`/Producto-Info/${product.codProducto}`}>
                    <h5 className="text-md font-semibold tracking-tight text-gray-900">
                        {product.producto}
                    </h5>
                    </NavLink>

                    <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>

                    <div className="flex mt-2 justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                        ${parseFloat(product.precio).toFixed(2)}
                    </span>
                    <button
                        className="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex"
                    >
                        <ICartIcon />
                        <PlusIcon />
                    </button>
                    </div>
                </div>
                </div>
            </li>
            ))}
        </ul>
        </main>
    );
}
