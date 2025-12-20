import React from "react";
import { FaHeadphones, FaClock, FaGamepad, FaMobileAlt, FaBluetoothB } from "react-icons/fa";
import { MdSpeaker } from "react-icons/md";
import { Link } from "react-router-dom";

const categories = [
  { id: 1, title: "True Wireless Earbuds", icon: <FaHeadphones className="text-3xl" /> },
  { id: 2, title: "Neckbands", icon: <FaBluetoothB className="text-3xl" /> },
  { id: 3, title: "Smart Watches", icon: <FaClock className="text-3xl" /> },
  { id: 4, title: "Wireless Headphones", icon: <FaHeadphones className="text-3xl" /> },
  { id: 5, title: "Wireless Speakers", icon: <MdSpeaker className="text-3xl" /> },
];

const Categories = () => {
  return (
    <div className="py-10 bg-white">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Shop by Categories</h2>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
                <Link 
                  to={`/category/${cat.title}`} 
                  key={cat.id} 
                  className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group"
                >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center p-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        {cat.icon}
                    </div>
                    <p className="text-sm font-medium text-center leading-tight group-hover:text-primary transition-colors">{cat.title}</p>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
