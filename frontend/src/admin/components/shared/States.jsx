import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton = ({ rows = 5 }) => {
    return (
        <div className="space-y-4 w-full">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <Icon size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
        {action}
    </motion.div>
);
