import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkMode = () => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const element = document.documentElement; // html element

  React.useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-12 h-12 flex items-center justify-center cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 text-2xl"
      >
        {theme === "dark" ? (
          <FaSun className="text-yellow-500" />
        ) : (
          <FaMoon className="text-gray-800" />
        )}
      </button>
    </div>
  );
};

export default DarkMode;