import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiList,
  FiBookOpen,
  FiCamera,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Menu");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/menu")) setActiveItem("Menu");
    else if (path.includes("/admin/orders")) setActiveItem("Orders");
    else if (path.includes("/admin/scan")) setActiveItem("Scan QR");
  }, [location.pathname]);

  const menuItems = [
    { name: "Menu", icon: <FiBookOpen />, path: "/admin/menu" },
    { name: "Orders", icon: <FiList />, path: "/admin/orders" },
    { name: "Scan QR", icon: <FiCamera />, path: "/admin/scan" },
  ];

  const handleNavigation = (itemName, path) => {
    setIsOpen(false);
    setActiveItem(itemName);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-lg shadow-purple-900/10">
      {/* Purple accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900"></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with black and purple style */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <span className="text-xl font-bold flex items-center">
              <span className="text-white font-extrabold tracking-wide">
                MUNCH
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">
                  MATE
                </span>
              </span>
              <div className="ml-3 px-2 py-0.5 rounded-md bg-black border border-purple-500/50 shadow-md shadow-purple-500/20">
                <span className="text-xs text-purple-400 font-medium tracking-wider">
                  ADMIN
                </span>
              </div>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`group relative flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeItem === item.name
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {/* Active item background effect - properly aligned */}
                {activeItem === item.name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-purple-900/30 border border-purple-500/20 rounded-md"></div>
                )}

                {/* Hover effect - properly aligned at bottom */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 transform transition-transform duration-300 ${
                    activeItem === item.name
                      ? "bg-gradient-to-r from-purple-800 to-purple-500"
                      : "bg-gradient-to-r from-purple-800 to-purple-500 scale-x-0 group-hover:scale-x-100 origin-left"
                  }`}
                ></div>

                {/* Ensure content is centered and aligned */}
                <div className="flex items-center space-x-2 relative z-10">
                  <span
                    className={`text-lg ${
                      activeItem === item.name ? "text-purple-400" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:bg-purple-900/20 hover:text-white transition-colors border border-purple-500/20"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-sm border-t border-purple-500/20 px-4 py-2 shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.name}
              onClick={() => handleNavigation(item.name, item.path)}
              className={`flex items-center px-4 py-3 my-1 rounded-md cursor-pointer transition-all duration-200 ${
                activeItem === item.name
                  ? "bg-gradient-to-r from-black to-purple-900/30 text-white border border-purple-500/20"
                  : "text-gray-400 hover:bg-purple-900/10 hover:text-white"
              }`}
            >
              <span
                className={`mr-3 ${
                  activeItem === item.name ? "text-purple-400" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
