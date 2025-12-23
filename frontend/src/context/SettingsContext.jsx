import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // Default settings to avoid crashing before fetch
    const [settings, setSettings] = useState({
        siteName: 'Shoping App',
        logoUrl: '',
        faviconUrl: '',
        themeColor: '#3b82f6',
        maintenanceMode: false,
        supportEmail: '',
        phoneNumber: '',
        address: '',
        currency: '₹',
        taxRate: 18,
        shippingCharge: 50,
        freeShippingThreshold: 1000,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            // Using relative path assuming proxy is set up in Vite
            const { data } = await axios.get('/api/settings');
            if (data) {
                setSettings(data);
                
                // Dynamic Updates (Favicon, Title)
                if (data.metaTitle) document.title = data.metaTitle;
                if (data.faviconUrl) {
                    const link = document.querySelector("link[rel~='icon']");
                    if (link) link.href = data.faviconUrl;
                }
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Socket.IO Listener
        // Socket.IO Listener
        const SOCKET_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/');
        const socket = io(SOCKET_URL);

        socket.on('settingsUpdated', (updatedSettings) => {
            console.log('Settings updated via socket:', updatedSettings);
            setSettings(updatedSettings);
            // Apply immediate side effects
            if (updatedSettings.metaTitle) document.title = updatedSettings.metaTitle;
            if (updatedSettings.faviconUrl) {
                const link = document.querySelector("link[rel~='icon']");
                if (link) link.href = updatedSettings.faviconUrl;
            }
        });

        return () => socket.disconnect();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
