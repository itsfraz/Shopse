import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Keep for context if needed, though usually in App
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import Categories from "../components/Categories/Categories";
import Lifestyle from "../components/Lifestyle/Lifestyle";
import Footer from "../components/Footer/Footer";
import Popup from "../components/Popup/Popup";

const Home = ({ handleOrderPopup }) => {
  return (
    <div className="bg-white">
      <Hero handleOrderPopup={handleOrderPopup} />
      <Categories />
      <Lifestyle />
      
      <div className="container mt-10">
        <h2 className="text-3xl font-bold mb-4">Explore <span className="underline decoration-primary underline-offset-4">Bestsellers</span></h2>
        <Products limit={4} />
      </div>
    </div>
  );
};

export default Home;
