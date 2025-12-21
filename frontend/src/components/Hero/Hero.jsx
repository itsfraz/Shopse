import React from "react";
import Slider from "react-slick";
import Image1 from "../../assets/products/SMW2.webp";
import Image2 from "../../assets/products/WHF3.webp";
import Image3 from "../../assets/products/SWSB4.webp";

const ImageList = [
  {
    id: 1,
    img: Image1,
    subtitle: "Smart Wearable",
    title: "Storm Call 2",
    price: "Starting at ₹1,799",
    highlight: "Health & Fitness",
  },
  {
    id: 2,
    img: Image2,
    subtitle: "Wireless Headphones",
    title: "Rockerz 650",
    price: "Starting at ₹2,499",
    highlight: "Pure Bass Sound",
  },
  {
    id: 3,
    img: Image3,
    subtitle: "Party Speakers",
    title: "Stone 1350",
    price: "Starting at ₹5,999",
    highlight: "Be the Life of Party",
  },
];

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-950 duration-200">
      <Slider {...settings}>
        {ImageList.map((data) => (
          <div key={data.id} className="relative w-full outline-none">
            {/* Full Width Banner Container */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full bg-black">
                {/* Background Image (Using object-cover for banner effect) */}
                <img 
                    src={data.img} 
                    alt={data.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container text-white p-4">
                        <div className="max-w-lg space-y-4">
                            <p className="text-lg font-medium tracking-wide text-brandGray uppercase" data-aos="fade-up">{data.subtitle}</p>
                            <h1 className="text-5xl md:text-7xl font-bold uppercase leading-tight" data-aos="fade-up" data-aos-delay="100">
                                {data.title}
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-bold text-red-500 uppercase" data-aos="fade-up" data-aos-delay="200">
                                {data.highlight}
                            </h2>
                            <p className="text-xl font-semibold" data-aos="fade-up" data-aos-delay="300">
                                {data.price}
                            </p>
                            <div data-aos="fade-up" data-aos-delay="400">
                                <button
                                    onClick={handleOrderPopup}
                                    className="bg-primary hover:bg-secondary text-white py-3 px-8 rounded-full font-bold uppercase tracking-wider transition-transform hover:scale-105"
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
