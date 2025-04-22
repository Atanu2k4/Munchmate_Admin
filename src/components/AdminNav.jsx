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
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/30 shadow-lg shadow-white/10">
      {/* White glowing dot */}
      <div className="absolute top-6 right-6 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,0.7)]"></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Munch
              </span>
              <span className="text-white">Mate</span>
              <span className="text-xs ml-2 text-white border border-white/50 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`flex items-center space-x-2 cursor-pointer relative py-5 font-bold ${
                  activeItem === item.name
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {activeItem === item.name && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-md"></span>
                )}
              </a>
            ))}

            {/* Admin button */}
            <button
              onClick={() => navigate("/admin/profile")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-bold ${
                activeItem === "Profile"
                  ? "bg-white text-black border-white"
                  : "bg-black text-white border-white/50 hover:bg-gray-900"
              }`}
            >
              <FiUser />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black px-2 pt-2 pb-3 space-y-1 shadow-lg border-b border-white/30">
          {menuItems.map((item) => (
            <a
              key={item.name}
              onClick={() => handleNavigation(item.name, item.path)}
              className={`block px-3 py-2 rounded-md text-base font-bold cursor-pointer ${
                activeItem === item.name
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </a>
          ))}
          <a
            onClick={() => navigate("/admin/profile")}
            className={`block px-3 py-2 rounded-md text-base font-bold cursor-pointer ${
              activeItem === "Profile"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-gray-900 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiUser />
              <span>Admin Profile</span>
            </div>
          </a>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
