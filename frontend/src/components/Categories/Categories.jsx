import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid } from 'lucide-react'; 
// We'll use a generic icon if no specific icon/image mapping is found
// In a real app, you might serve images from the backend

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
            setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return null; // Or a skeleton

  if (categories.length === 0) return null;

  return (
    <div className="py-10 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Shop by Categories</h2>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.filter(c => c.isActive).map((cat) => (
                <Link 
                  to={`/category/${cat.name}`} 
                  key={cat._id} 
                  className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group"
                >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center p-2 overflow-hidden group-hover:bg-primary transition-all duration-300 shadow-sm border border-transparent group-hover:border-primary/20">
                         {/* If the category has an image URL, use it, otherwise generic icon */}
                         {cat.image ? (
                             <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                         ) : (
                             <Grid className="text-3xl text-gray-400 group-hover:text-white" />
                         )}
                    </div>
                    <p className="text-sm font-medium text-center leading-tight text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</p>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
