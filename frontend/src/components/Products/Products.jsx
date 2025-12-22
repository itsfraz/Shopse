import React, { useState, useEffect } from "react";
import ProductsData from "../../data/products";
import useProductFiltering from "../../hooks/useProductFiltering";
import ProductCard from "./ProductCard";

const Products = ({ category, limit, searchQuery }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = limit ? limit : 8; // Use limit if provided

  // Use custom hook for filtering logic
  const {
      filterCategory,
      setFilterCategory,
      filterRating,
      setFilterRating,
      sortOption,
      setSortOption,
      filteredProducts
  } = useProductFiltering(ProductsData, category, searchQuery);

  useEffect(() => {
    // Sync external category prop if it changes
    if (category) {
        setFilterCategory(category);
    }
  }, [category, setFilterCategory]);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Reset page when filters change
  useEffect(() => {
      setCurrentPage(1);
  }, [filterCategory, filterRating, sortOption]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // If limit is active, just take the first N products without pagination offset
  const currentProducts = limit 
      ? filteredProducts.slice(0, limit) 
      : filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const totalPages = limit ? 1 : Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const SkeletonCard = () => (
    <div className="space-y-3 bg-gray-200 dark:bg-gray-700 rounded-md p-4 animate-pulse">
      <div className="h-[220px] w-full bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Breadcrumb would go here if needed, keeping it minimal for now */}
        
        {/* Filters and Sorting Bar */}
        <div className="flex flex-wrap justify-end items-center mb-6 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          {/* Category Filter Removed as per request */}
          
          <div className="flex gap-6">
            {/* Rating Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="rating-filter" className="text-sm font-semibold text-gray-600 dark:text-gray-400">Rating:</label>
                <select
                id="rating-filter"
                className="p-1 border bg-white rounded-md text-sm dark:bg-gray-700 dark:text-white"
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                >
                <option value="0">All Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
                </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sort:</label>
                <select
                id="sort-by"
                className="p-1 border bg-white rounded-md text-sm dark:bg-gray-700 dark:text-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
            {isLoading
              ? Array.from({ length: productsPerPage }).map((_, index) => (
                  <div key={index} className="w-full"><SkeletonCard /></div>
                ))
              : currentProducts.map((data) => (
                  <div key={data.id} className="w-full">
                    <ProductCard data={data} />
                  </div>
                ))}
          </div>
          
          {/* No Results Message */}
          {!isLoading && currentProducts.length === 0 && (
             <div className="text-center py-20">
                 <h3 className="text-xl font-bold text-gray-500">No products found for these filters.</h3>
                 <button 
                    onClick={() => { setFilterCategory("All"); setFilterRating(0); }}
                    className="mt-4 text-primary underline"
                 >
                    Clear Filters
                 </button>
             </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !limit && totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
                <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                >
                Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-md font-bold transition-colors ${
                    currentPage === page
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-800 dark:text-white"
                    }`}
                >
                    {page}
                </button>
                ))}
                <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                >
                Next
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;