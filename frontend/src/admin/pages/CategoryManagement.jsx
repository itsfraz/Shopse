import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/shared/Toast';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Save,
    X,
    Loader,
    Grid
} from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || '',
                isActive: category.isActive !== undefined ? category.isActive : true
            });
        } else {
            setFormData({
                name: '',
                description: '',
                image: '',
                isActive: true
            });
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {category ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                        <input 
                            type="text" 
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            placeholder="https://example.com/category-image.png"
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
            addToast("Failed to fetch categories", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
                addToast("Category deleted successfully", 'success');
            } catch (error) {
                console.error("Delete error", error);
                addToast("Failed to delete category", 'error');
            }
        }
    };

    const handleSave = async (categoryData) => {
        try {
            if (editingCategory) {
                const { data } = await api.put(`/categories/${editingCategory._id}`, categoryData);
                setCategories(categories.map(c => c._id === editingCategory._id ? data : c));
                addToast("Category updated successfully", 'success');
            } else {
                const { data } = await api.post('/categories', categoryData);
                setCategories([...categories, data]);
                addToast("Category created successfully", 'success');
            }
            setIsModalOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Save error", error);
            addToast("Failed to save category", 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Categories
                </h2>
                <div className="flex gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                         <input 
                            type="text" 
                            placeholder="Search categories..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm dark:text-white"
                         />
                    </div>
                    <button 
                        onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-20">
                        <Loader className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((category) => (
                        <motion.div 
                            key={category._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl w-14 h-14 flex items-center justify-center overflow-hidden">
                                    {category.image ? (
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Grid size={24} />
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{category.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{category.description || 'No description'}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
             {categories.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No categories found.
                    </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <CategoryModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        category={editingCategory}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManagement;
