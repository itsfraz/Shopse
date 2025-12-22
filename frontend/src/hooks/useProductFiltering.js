import { useState, useMemo } from 'react';

const useProductFiltering = (products, initialCategory = 'All', searchQuery = '') => {
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState('popularity');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query Filter
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase().trim();
        result = result.filter(product => 
            product.name.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerQuery))
        );
    }

    // Category Filter (only apply if not 'All' - keeps existing logic)
    if (filterCategory !== 'All') {
      result = result.filter((product) => product.category === filterCategory);
    }

    // Rating Filter
    // Rating Filter (handling missing rating validation)
    if (filterRating > 0) {
        result = result.filter((product) => (product.rating || 0) >= filterRating);
    }

    // Sorting
    if (sortOption === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        // Default to popularity
        // Default to popularity (or random if no rating)
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, filterCategory, filterRating, sortOption, searchQuery]);

  return {
    filterCategory,
    setFilterCategory,
    filterRating,
    setFilterRating,
    sortOption,
    setSortOption,
    filteredProducts
  };
};

export default useProductFiltering;
