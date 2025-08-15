import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { catalogTypeService } from '../services';

const CatalogTypeForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        description: item?.description || '',
        active: item?.active ?? true
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateToken()) {
            return;
        }

        if (!formData.description.trim()) {
            setError('La descripción es requerida');
            return;
        }

        const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!pattern.test(formData.description)) {
            setError('La descripción solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await catalogTypeService.update(item.id, formData);
                if (!savedItem) {
                    savedItem = { ...item, ...formData };
                }
                onSuccess(savedItem, true);
            } else {
                savedItem = await catalogTypeService.create(formData);
                if (!savedItem) {
                    savedItem = { 
                        id: Date.now(),
                        ...formData 
                    };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el tipo de catálogo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-14 h-14 bg-[#d2b48c] rounded-full flex items-center justify-center shadow mb-2">
                            <img
                                src="https://i.pinimg.com/736x/2a/58/a9/2a58a9c65d07c17aa32b7c0a7bff1861.jpg"
                                alt="Café"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-[#6f4e37]">
                            {item ? 'Editar Tipo de Catálogo' : 'Nuevo Tipo de Catálogo'}
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-[#6f4e37] mb-1">
                                Descripción *
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-[#d2b48c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f4e37] bg-[#fff8e7] text-[#6f4e37]"
                                placeholder="Ej: Producto, Combo"
                                maxLength="100"
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-[#6f4e37] focus:ring-[#6f4e37] border-[#d2b48c] rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-[#6f4e37]">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-[#6f4e37] bg-[#fff8e7] hover:bg-[#d2b48c] rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#6f4e37] hover:bg-[#8b6f47] rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogTypeForm;