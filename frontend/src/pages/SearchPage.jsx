import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Products from "../components/Products/Products";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  return (
    <div className="pt-24 pb-12">
        <div className="container">
            <h1 className="text-3xl font-bold text-center mb-2">Search Results</h1>
            <p className="text-center text-gray-500 mb-8">
                Showing results for <span className="font-bold text-primary">"{query}"</span>
            </p>
        </div>
      <Products searchQuery={query} />
    </div>
  );
};

export default SearchPage;
