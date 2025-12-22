import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-orange-500" />,
        info: <Info size={20} className="text-blue-500" />
    };

    const styles = {
         success: 'border-green-500/20 bg-green-50 dark:bg-green-900/10',
         error: 'border-red-500/20 bg-red-50 dark:bg-red-900/10',
         warning: 'border-orange-500/20 bg-orange-50 dark:bg-orange-900/10',
         info: 'border-blue-500/20 bg-blue-50 dark:bg-blue-900/10'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 px-4 py-3 min-w-[300px] rounded-lg shadow-lg border backdrop-blur-md bg-white/90 dark:bg-gray-800/90 ${styles[type] || styles.info}`}
        >
            {icons[type]}
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</p>
        </motion.div>
    );
};
