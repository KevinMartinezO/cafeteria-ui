import { useState, useEffect } from 'react';
import { catalogTypeService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import CatalogTypeForm from './CatalogTypeForm';

const CatalogTypesList = () => {
    const [catalogTypes, setCatalogTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null); // Para highlight temporal
    const [successMessage, setSuccessMessage] = useState(''); // Para mensajes de éxito
    const { validateToken } = useAuth();

    useEffect(() => {
        loadCatalogTypes();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => {
                setRecentlyUpdated(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadCatalogTypes = async () => {
        if (!validateToken()) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            const data = await catalogTypeService.getAll();
            setCatalogTypes(data);
        } catch (error) {
            console.error('Error al cargar tipos de catálogo:', error);
            setError(error.message || 'Error al cargar los tipos de catálogo');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) {
            return;
        }

        const hasProducts = item.number_of_products > 0;

        if (hasProducts) {
            setError(`No se puede eliminar el tipo "${item.description}" porque está en uso por ${item.number_of_products} producto(s).`);
            return;
        }

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar el tipo de catálogo "${item.description}"?\n\nEste tipo será eliminado permanentemente del sistema.\n\n¿Deseas continuar?`
        );

        if (confirmed) {
            try {
                setError('');
                await catalogTypeService.deactivate(item.id);
                await loadCatalogTypes();
                setSuccessMessage('Tipo de catálogo eliminado exitosamente');
            } catch (error) {
                console.error('Error al procesar:', error);
                setError(error.message || 'Error al eliminar el tipo de catálogo');
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadCatalogTypes();
        setRecentlyUpdated(savedItem.id);

        const message = isEdit ? 'Tipo de catálogo actualizado exitosamente' : 'Tipo de catálogo creado exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando tipos de catálogo...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#d2b48c] rounded-full flex items-center justify-center shadow">
                        <img
                            src="https://i.pinimg.com/736x/2a/58/a9/2a58a9c65d07c17aa32b7c0a7bff1861.jpg"
                            alt="Café"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-[#d2b48c]">Tipos de Catálogo</h1>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#d2b48c] hover:bg-[#d2b48c] text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Tipo
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {catalogTypes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay tipos de catálogo registrados
                                </td>
                            </tr>
                        ) : (
                            catalogTypes.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id 
                                            ? 'bg-green-50 border-l-4 border-green-400' 
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                            (item.number_of_products || 0) > 0 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.number_of_products || 0} productos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className={`${
                                                    (item.number_of_products || 0) > 0
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-red-600 hover:text-red-900'
                                                }`}
                                            >
                                                {(item.number_of_products || 0) > 0 ? 'Desactivar' : 'Eliminar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CatalogTypeForm
                    item={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default CatalogTypesList;