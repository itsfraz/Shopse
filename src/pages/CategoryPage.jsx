import React from "react";
import { useParams } from "react-router-dom";
import Products from "../components/Products/Products";

const CategoryPage = () => {
  const { category } = useParams();

  // Decode URI component just in case (e.g., "Mens%20Wear" -> "Mens Wear")
  const decodedCategory = decodeURIComponent(category);

  return (
    <div className="pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8">{decodedCategory}</h1>
      <Products category={decodedCategory} />
    </div>
  );
};

export default CategoryPage;
