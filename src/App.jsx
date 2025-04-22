import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminNav from "./components/AdminNav";
import AdminMenu from "./components/AdminMenu";
import AdminScanQR from "./components/AdminScanQR";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      <main className="pt-16">
        {" "}
        {/* Add padding-top to account for fixed navbar */}
        <Routes>
          {/* Redirect root to admin menu */}
          <Route path="/" element={<Navigate to="/admin/menu" replace />} />

          {/* Admin routes */}
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route
            path="/admin/orders"
            element={
              <div className="container mx-auto py-20 px-6">
                <h2 className="text-2xl font-bold">Orders Management</h2>
                <p className="mt-4">Orders management coming soon...</p>
              </div>
            }
          />
          <Route path="/admin/scan" element={<AdminScanQR />} />
          <Route
            path="/admin/profile"
            element={
              <div className="container mx-auto py-20 px-6">
                <h2 className="text-2xl font-bold">Admin Profile</h2>
                <p className="mt-4">Profile management coming soon...</p>
              </div>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/admin/menu" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
