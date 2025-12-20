import { useState, useMemo } from 'react';

const useProductFiltering = (products, initialCategory = 'All') => {
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState('popularity');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
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
  }, [products, filterCategory, filterRating, sortOption]);

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
