import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/shared/Toast';
import { useSettings } from '../../context/SettingsContext';
import { 
    Save, 
    Store, 
    Truck, 
    Layout, 
    Lock, 
    Globe,
    Phone,
    Mail,
    MapPin,
    ToggleLeft,
    ToggleRight,
    Loader
} from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>
        {children}
    </div>
);

const Toggle = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
        <button 
            onClick={() => onChange(!enabled)}
            className={`text-2xl transition-colors ${enabled ? 'text-green-500' : 'text-gray-400'}`}
            type="button"
        >
            {enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
    </div>
);

const Settings = () => {
    const { settings: globalSettings, fetchSettings } = useSettings();
    const [formData, setFormData] = useState(null);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (globalSettings) {
            setFormData(globalSettings);
        }
    }, [globalSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.put('/settings', formData);
            addToast("Settings updated successfully", "success");
            // Refresh global settings immediately
            fetchSettings(); 
        } catch (error) {
            console.error("Settings update failed", error);
            addToast("Failed to update settings", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!formData) return (
         <div className="flex items-center justify-center h-full py-20">
            <Loader className="animate-spin text-blue-600" size={32} />
         </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 dark:bg-gray-900 z-20 py-4 backdrop-blur-sm bg-opacity-80">
                 <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Global Settings
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage site configuration, SEO, and business rules.</p>
                 </div>
                 <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                 </button>
            </div>

            {/* General Store Info */}
            <SettingsSection title="General Information" icon={Store}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
                        <input 
                            type="text" 
                            name="siteName"
                            value={formData.siteName} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none  dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency Symbol</label>
                        <select 
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none  dark:text-white"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Color (Hex)</label>
                         <div className="flex gap-2">
                            <input 
                                type="color" 
                                name="themeColor"
                                value={formData.themeColor} 
                                onChange={handleChange}
                                className="h-10 w-20 rounded cursor-pointer"
                            />
                            <input 
                                type="text"
                                name="themeColor"
                                value={formData.themeColor}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white uppercase"
                            />
                         </div>
                    </div>
                     <div className="col-span-2">
                        <Toggle 
                            label="Maintenance Mode (Close site for visitors)" 
                            enabled={formData.maintenanceMode} 
                            onChange={(val) => setFormData(prev => ({ ...prev, maintenanceMode: val }))} 
                        />
                    </div>
                </div>
            </SettingsSection>

            {/* Contact Information */}
            <SettingsSection title="Contact Information" icon={Phone}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                name="supportEmail"
                                value={formData.supportEmail} 
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                         <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                name="phoneNumber"
                                value={formData.phoneNumber} 
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea
                                name="address"
                                value={formData.address} 
                                onChange={handleChange}
                                rows="2"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            ></textarea>
                        </div>
                    </div>
                 </div>
            </SettingsSection>

            {/* Shipping & Tax */}
            <SettingsSection title="Business Rules" icon={Truck}>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free Shipping Threshold</label>
                        <input 
                            type="number" 
                            name="freeShippingThreshold"
                            value={formData.freeShippingThreshold}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Charge</label>
                        <input 
                            type="number" 
                            name="shippingCharge"
                            value={formData.shippingCharge}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                        <input 
                            type="number" 
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        />
                    </div>
                 </div>
            </SettingsSection>

            {/* SEO Settings */}
            <SettingsSection title="SEO Configuration" icon={Globe}>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
                        <input 
                            type="text" 
                            name="metaTitle"
                            value={formData.metaTitle} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            placeholder="e.g. Best Shop - Online Store"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Description</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription} 
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            placeholder="Brief description for search engines..."
                        ></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords</label>
                        <input 
                            type="text" 
                            name="metaKeywords"
                            value={formData.metaKeywords} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            placeholder="comma, separated, keywords"
                        />
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default Settings;
