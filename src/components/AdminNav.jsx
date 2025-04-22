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
    else if (path.includes("/admin/profile")) setActiveItem("Profile");
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10">
      {/* Top highlight line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <span className="text-xl font-bold flex items-center">
              <div className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
              <span className="text-white">
                Munch<span className="text-blue-400">Mate</span>
              </span>
              <span className="text-xs ml-2 text-white border-l border-white/30 pl-2">
                ADMIN
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`flex items-center space-x-2 cursor-pointer relative py-5 font-bold group ${
                  activeItem === item.name
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span
                  className={`text-lg ${
                    activeItem === item.name
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-blue-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {activeItem === item.name && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                )}
              </a>
            ))}

            {/* Admin button */}
            <button
              onClick={() => navigate("/admin/profile")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-bold ${
                activeItem === "Profile"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-black text-white border border-blue-500/30 hover:border-blue-500/60"
              }`}
            >
              <FiUser
                className={
                  activeItem === "Profile" ? "text-white" : "text-blue-400"
                }
              />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md bg-black/40 border border-white/10"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Slide down animation could be added */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-black to-gray-900 px-2 pt-2 pb-3 space-y-1 shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.name}
              onClick={() => handleNavigation(item.name, item.path)}
              className={`block px-3 py-3 rounded-md text-base font-bold cursor-pointer ${
                activeItem === item.name
                  ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-white border-l-4 border-blue-500"
                  : "text-gray-300 hover:bg-gray-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={activeItem === item.name ? "text-blue-400" : ""}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
            </a>
          ))}
          <a
            onClick={() => navigate("/admin/profile")}
            className={`block px-3 py-3 rounded-md text-base font-bold cursor-pointer ${
              activeItem === "Profile"
                ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-white border-l-4 border-blue-500"
                : "text-gray-300 hover:bg-gray-900/50 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <FiUser
                className={activeItem === "Profile" ? "text-blue-400" : ""}
              />
              <span>Admin Profile</span>
            </div>
          </a>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
