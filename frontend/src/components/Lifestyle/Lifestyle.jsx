import React from "react";
import { Link } from "react-router-dom";
import Img1 from "../../assets/products/SMW2.webp"; // Fitness -> Smart Watch
import Img2 from "../../assets/products/SWSB4.webp"; // Parties -> Speaker
import Img3 from "../../assets/products/TWS2.webp"; // Work -> TWS
import Img4 from "../../assets/products/WHF3.webp"; // Audiophiles -> Headphones

const lifestyles = [
  { id: 1, title: "For Fitness", img: Img1, link: "/category/Smart Watches" },
  { id: 2, title: "For Parties", img: Img2, link: "/category/Wireless Speakers" },
  { id: 3, title: "For Work", img: Img3, link: "/category/True Wireless Earbuds" },
  { id: 4, title: "For Audiophiles", img: Img4, link: "/category/Wireless Headphones" },
];

const Lifestyle = () => {
  return (
    <div className="py-10 bg-white">
      <div className="container">
        {/* <h2 className="text-2xl font-bold mb-8">Shop by Lifestyle</h2> */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {lifestyles.map((item) => (
                <Link to={item.link} key={item.id} className="relative group cursor-pointer bg-gray-100 rounded-t-[100px] rounded-b-lg overflow-hidden pb-4">
                     {/* Image Container with Arch */}
                    <div className="h-[250px] w-full overflow-hidden">
                        <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    
                    {/* Content */}
                    <div className="mt-4 text-center">
                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                        <p className="text-primary font-bold text-sm flex items-center justify-center gap-1">
                            View All 
                            <span className="text-xs border rounded-full border-primary w-4 h-4 flex items-center justify-center">&gt;</span>
                        </p>
                    </div>

                    {/* Overlay (Optional) */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-100/50 to-transparent pointer-events-none"></div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;
