import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    X, Save, Plus, Trash2, Image as ImageIcon, 
    List, Star, MessageSquare, Check, XCircle, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import { useToast } from './shared/Toast';

const ProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        highlights: [''],
        specifications: [{ key: '', value: '' }],
        isActive: true,
        images: [''],
        reviews: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || '',
                price: product.price || '',
                stock: product.stock || '',
                description: product.description || '',
                highlights: product.highlights && product.highlights.length > 0 ? product.highlights : [''],
                specifications: product.specifications && product.specifications.length > 0 ? product.specifications : [{ key: '', value: '' }],
                isActive: product.isActive !== undefined ? product.isActive : true,
                images: product.images && product.images.length > 0 ? product.images : [''],
                reviews: product.reviews || []
            });
        } else {
            setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                highlights: [''],
                specifications: [{ key: '', value: '' }],
                isActive: true,
                images: [''],
                reviews: []
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHighlightChange = (index, value) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };

    const addHighlight = () => {
        setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
    };

    const removeHighlight = (index) => {
        setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpec = () => {
        setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
    };

    const removeSpec = (index) => {
        setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index) }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedImages = formData.images.map(url => url.trim()).filter(url => url.length > 0);
        const processedHighlights = formData.highlights.map(h => h.trim()).filter(h => h.length > 0);
        const processedSpecs = formData.specifications.filter(s => s.key.trim() && s.value.trim());

        onSave({ 
            ...formData, 
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: processedImages.length > 0 ? processedImages : ['https://via.placeholder.com/150'],
            highlights: processedHighlights,
            specifications: processedSpecs
        });
    };

    // Review Actions (Direct API calls as these are strictly sub-resource actions)
    const handleApproveReview = async (reviewId) => {
        try {
            await api.put(`/products/${product._id}/reviews/${reviewId}/approve`);
            addToast('Review approved', 'success');
            // Update local state to reflect change immediately
            setFormData(prev => ({
                ...prev,
                reviews: prev.reviews.map(r => r._id === reviewId ? { ...r, isApproved: true } : r)
            }));
        } catch (error) {
            console.error(error);
            addToast('Failed to approve review', 'error');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/products/${product._id}/reviews/${reviewId}`);
            addToast('Review deleted', 'success');
            setFormData(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r._id !== reviewId)
            }));
        } catch (error) {
            console.error(error);
            addToast('Failed to delete review', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {product ? <Edit2 size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
                    {['general', 'specs', 'images', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === tab 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            {tab === 'general' && <List size={16} />}
                            {tab === 'specs' && <List size={16} />} 
                            {tab === 'images' && <ImageIcon size={16} />}
                            {tab === 'reviews' && <MessageSquare size={16} />}
                            <span className="capitalize">{tab === 'specs' ? 'Specifications' : tab}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/10 custom-scrollbar">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required>
                                            <option value="" className="bg-white dark:bg-gray-800">Select Category</option>
                                            {categories.map(cat => <option key={cat._id} value={cat.name} className="bg-white dark:bg-gray-800">{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <input 
                                            type="checkbox" 
                                            name="isActive" 
                                            checked={formData.isActive} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                            className="w-5 h-5 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" 
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400" required></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlights</label>
                                        <div className="space-y-2">
                                            {formData.highlights.map((highlight, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={highlight} 
                                                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 flex-1"
                                                        placeholder="Feature highlight..."
                                                    />
                                                    <button type="button" onClick={() => removeHighlight(index)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-200 dark:hover:border-red-800"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={addHighlight} className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium hover:underline">
                                                <Plus size={16} /> Add Highlight
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SPECIFICATIONS TAB */}
                        {activeTab === 'specs' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Technical Specifications</h3>
                                    <button type="button" onClick={addSpec} className="btn-secondary text-sm">
                                        <Plus size={16} className="mr-1" /> Add Spec
                                    </button>
                                </div>
                                {formData.specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-4 items-start bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <input 
                                            type="text" 
                                            placeholder="Key (e.g., Material)" 
                                            value={spec.key} 
                                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                            className="w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Value (e.g., Cotton)" 
                                            value={spec.value} 
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                                        />
                                        <button type="button" onClick={() => removeSpec(index)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {formData.specifications.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No specifications added yet.</p>
                                )}
                            </div>
                        )}

                        {/* IMAGES TAB */}
                        {activeTab === 'images' && (
                            <div className="space-y-4 animate-fadeIn">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                            {url ? <img src={url} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-4 text-gray-400" />}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={url} 
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                                            placeholder="Image URL..."
                                        />
                                        <button type="button" onClick={() => {
                                            const newImages = formData.images.filter((_, i) => i !== index);
                                            setFormData({...formData, images: newImages});
                                        }} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))} className="btn-secondary w-full justify-center">
                                    <Plus size={16} className="mr-2" /> Add Image
                                </button>
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-4 animate-fadeIn">
                                {formData.reviews.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                        <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No reviews yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.reviews.map((review) => (
                                            <div key={review._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                                            ))}
                                                        </div>
                                                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{review.name}</span>
                                                        <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                                                    <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${review.isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                        {review.isApproved ? 'Approved' : 'Pending Approval'}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!review.isApproved && (
                                                        <button type="button" onClick={() => handleApproveReview(review._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip" title="Approve">
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    <button type="button" onClick={() => handleDeleteReview(review._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg tooltip" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 z-10">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="product-form" className="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                        <Save size={18} />
                        Save all changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Simple icon for edit in header
const Edit2 = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default ProductModal;
