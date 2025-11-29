import { useState } from "react";
import type { Usuario } from "../../types/usuario";
import { EditIcon, TrashIcon } from "../icons";

type Props = {
    usuarios: Usuario[];
    loading?: boolean;
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
};

export default function UsuarioTable({ usuarios, loading, onEdit, onDelete }: Props) {
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

    const confirmarEliminacion = () => {
        if (usuarioAEliminar) {
            onDelete(usuarioAEliminar.id);
            setUsuarioAEliminar(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando usuarios...</div>;
    if (usuarios.length === 0) return <div className="p-4 text-center text-gray-500">No hay usuarios registrados.</div>;

    return (
        <div className="w-full relative">
            {/* ==========================================
                VISTA MÓVIL (< 768px) - Cards
               ========================================== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">ID</span>
                                <p className="text-gray-900 font-medium">#{usuario.id}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Rol: {usuario.rolId}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Email</span>
                            <p className="text-gray-900 font-semibold break-all">{usuario.email}</p>
                        </div>
                        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => onEdit(usuario)}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-md font-medium hover:bg-yellow-600 active:scale-95 transition-all"
                            >
                                <EditIcon /> Editar
                            </button>
                            <button
                                onClick={() => setUsuarioAEliminar(usuario)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 active:scale-95 transition-all"
                            >
                                <TrashIcon /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==========================================
                VISTA DESKTOP (>= 768px) - Tabla
               ========================================== */}
            <div className="hidden md:block w-full">
                <div className="overflow-hidden rounded-xl border border-gray-300 shadow bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">ID</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Email</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Rol ID</th>
                                    <th className="px-6 py-4 text-center whitespace-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{usuario.id}</td>
                                        <td className="px-6 py-4">{usuario.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-300">
                                                {usuario.rolId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button
                                                onClick={() => onEdit(usuario)}
                                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                                                title="Editar"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                onClick={() => setUsuarioAEliminar(usuario)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Eliminar"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ==========================================
                MODAL DE CONFIRMACIÓN
               ========================================== */}
            {usuarioAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="p-6 pb-0 flex flex-col items-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <TrashIcon /> {/* Puedes usar un icono más grande aquí si quieres */}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center">¿Eliminar usuario?</h3>
                            <p className="mt-2 text-sm text-gray-500 text-center">
                                Estás a punto de eliminar al usuario <strong>"{usuarioAEliminar.email}"</strong>.
                                <br />
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 mt-6">
                            <button
                                onClick={confirmarEliminacion}
                                className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-sm"
                            >
                                Sí, eliminar
                            </button>
                            <button
                                onClick={() => setUsuarioAEliminar(null)}
                                className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}