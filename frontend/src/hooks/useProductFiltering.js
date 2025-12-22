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
            product.title.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery) ||
            (product.color && product.color.toLowerCase().includes(lowerQuery))
        );
    }

    // Category Filter (only apply if not 'All' - keeps existing logic)
    if (filterCategory !== 'All') {
      result = result.filter((product) => product.category === filterCategory);
    }

    // Rating Filter
    result = result.filter((product) => product.rating >= filterRating);

    // Sorting
    if (sortOption === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
        result.sort((a, b) => b.id - a.id);
    } else {
        // Default to popularity
        result.sort((a, b) => b.rating - a.rating);
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
