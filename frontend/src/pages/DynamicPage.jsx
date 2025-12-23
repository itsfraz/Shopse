import React, { useEffect, useState } from 'react'; // Fixed imports
import { useParams, Navigate } from 'react-router-dom';
import { marked } from 'marked'; 
import DOMPurify from 'dompurify';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/common/Skeleton';

const DynamicPage = () => {
    const { slug } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                // Determine API URL based on environment or default to local proxy
                const apiUrl = '/api/pages/' + slug;
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    setPageData(data);
                    
                    // Update Page Title
                    document.title = data.seo?.metaTitle || data.title + ' | Boat Lifestyle Clone';
                    
                    // Ideally we would update meta description here too if using react-helmet
                } else {
                    setPageData(null);
                }
            } catch (error) {
                console.error("Error fetching page:", error);
                addToast("Failed to load page content", "error");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug, addToast]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-4xl">
                <Skeleton className="h-12 w-3/4 mb-8" />
                <div className="space-y-8">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">404</h1>
                <p className="text-gray-500 dark:text-gray-400">Page not found</p>
                <div className="mt-6">
                    <a href="/" className="text-blue-600 hover:underline">Return Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-white dark:bg-gray-900 dark:text-gray-100 font-outfit">
             {/* Hero Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-12 mb-10">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        {pageData.title}
                    </h1>
                     <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-center gap-2">
                         <a href="/" className="hover:text-blue-600">Home</a> 
                         <span>/</span>
                         <span className="capitalize">{pageData.slug.replace('-', ' ')}</span>
                     </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 max-w-4xl space-y-12">
                {pageData.sections.map((section, index) => (
                    <section key={section._id || index} className="prose dark:prose-invert max-w-none">
                        {section.heading && (
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 dark:border-gray-700">
                                {section.heading}
                            </h2>
                        )}
                        <div 
                            className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(marked.parse(section.content || '')) 
                            }} 
                        />
                    </section>
                ))}
                
                <div className="pt-8 border-t dark:border-gray-800 text-sm text-gray-400 text-center">
                    Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
