import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/shared/Toast';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    Image as ImageIcon,
    Save,
    X,
    Loader
} from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        isActive: true, // mapped to 'Active' status
        images: [] 
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                description: product.description,
                isActive: product.isActive !== undefined ? product.isActive : true,
                images: product.images && product.images.length > 0 ? product.images : ['']
            });
        } else {
            setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                isActive: true,
                images: ['']
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out empty image strings
        const processedImages = formData.images.map(url => url.trim()).filter(url => url.length > 0);
        
        onSave({ 
            ...formData, 
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: processedImages.length > 0 ? processedImages : ['https://via.placeholder.com/150'] // Fallback
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                            <input 
                                type="number" 
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                            <input 
                                type="number" 
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Product Images</label>
                         <div className="space-y-3">
                            {formData.images.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="https://example.com/image.jpg"
                                        value={url}
                                        onChange={(e) => {
                                            const newImages = [...formData.images];
                                            newImages[index] = e.target.value;
                                            setFormData({...formData, images: newImages});
                                        }}
                                        className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                    {formData.images.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                setFormData({...formData, images: newImages});
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Add another image
                            </button>
                         </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Product
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.products || []);
        } catch (error) {
            console.error("Error fetching products", error);
            addToast("Failed to fetch products", 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        // Socket.IO Real-time Stock Sync
        import('socket.io-client').then(({ io }) => {
            // In production, this URL might need to be env variable or inferred from window.location
            const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
            const socket = io(SOCKET_URL);

            socket.on('connect', () => {
                console.log('Connected to socket server for stock updates');
            });

            socket.on('stockUpdated', (updatedProduct) => {
                console.log('Stock Update Received:', updatedProduct);
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p._id === updatedProduct.productId 
                        ? { ...p, stock: updatedProduct.newStock } 
                        : p
                    )
                );
                
                // Optional: Show toast if viewing products list so admin knows something changed
                // (Debounce or subtle indicator might be better in high volume, but for now this is great feedback)
                addToast(`Stock updated for ${updatedProduct.name}`, 'info');
            });

            return () => {
                socket.disconnect();
            };
        });
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                addToast("Product deleted successfully", 'success');
            } catch (error) {
                console.error("Delete error", error);
                addToast("Failed to delete product", 'error');
            }
        }
    };

    const handleSave = async (productData) => {
        try {
            if (editingProduct) {
                const { data } = await api.put(`/products/${editingProduct._id}`, productData);
                setProducts(products.map(p => p._id === editingProduct._id ? data : p));
                addToast("Product updated successfully", 'success');
            } else {
                const { data } = await api.post('/products', productData);
                setProducts([data, ...products]);
                addToast("Product created successfully", 'success');
            }
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Save error", error);
            addToast("Failed to save product", 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Products
                </h2>
                <div className="flex gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                         <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm dark:text-white"
                         />
                    </div>
                    <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-all">
                        <Filter size={20} />
                    </button>
                    <button 
                        onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                         <div className="flex items-center justify-center h-full py-20">
                            <Loader className="animate-spin text-blue-600" size={32} />
                         </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-gray-400">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={20} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{product.price}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {product.stock > 0 ? (
                                                product.stock < 10 ? <span className="text-orange-500 font-medium">{product.stock} (Low)</span> : product.stock
                                            ) : (
                                                <span className="text-red-500 font-medium">Out of Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                ${product.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                {product.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {products.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">
                            No products found.
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <ProductModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        product={editingProduct}
                        onSave={handleSave}
                        categories={categories}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManagement;
