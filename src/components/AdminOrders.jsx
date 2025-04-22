import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiTruck,
  FiCheck,
  FiClock,
  FiX,
  FiCalendar,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";
import AdminNavbar from "../components/AdminNav";
import OrderInvoiceDetail from "../components/OrderInvoiceDetail";
import { db } from "../config"; // Import Firebase db
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit,
  startAfter,
  Timestamp
} from "firebase/firestore"; // Import Firestore functions

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  const fetchOrders = async (isLoadMore = false) => {
    try {
      setError(null);
      if (!isLoadMore) setLoading(true);
      
      // Create base query
      const invoicesRef = collection(db, "invoices");
      let q = query(invoicesRef, orderBy("date", "desc"), limit(10));
      
      // Apply filters
      if (statusFilter !== "all") {
        q = query(q, where("deliveryStatus", "==", statusFilter));
      }
      
      if (dateFilter !== "all") {
        const today = new Date();
        let startDate;
        
        if (dateFilter === "today") {
          startDate = new Date(today.setHours(0, 0, 0, 0));
        } else if (dateFilter === "week") {
          startDate = new Date(today.setDate(today.getDate() - 7));
        } else if (dateFilter === "month") {
          startDate = new Date(today.setMonth(today.getMonth() - 1));
        }
        
        q = query(q, where("date", ">=", Timestamp.fromDate(startDate)));
      }
      
      // Apply pagination for load more
      if (isLoadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
      
      const querySnapshot = await getDocs(q);
      
      // Check if we have more results
      setHasMore(!querySnapshot.empty);
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      
      const fetchedOrders = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      
      // Update state based on whether we're loading more or refreshing
      if (isLoadMore) {
        setOrders(prev => [...prev, ...fetchedOrders]);
      } else {
        setOrders(fetchedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreOrders = () => {
    if (hasMore) {
      fetchOrders(true);
    }
  };

  const handleRefresh = () => {
    setLastVisible(null);
    setHasMore(true);
    fetchOrders();
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setLastVisible(null);
  };
  
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setLastVisible(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, you'd need to implement server-side search
    // For now, just filter the existing orders client-side
    setOrders(orders.filter(order => 
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("delivered") || statusLower.includes("completed")) {
      return <FiCheck className="text-green-500" />;
    } else if (statusLower.includes("transit") || statusLower.includes("progress")) {
      return <FiTruck className="text-blue-500" />;
    } else if (statusLower.includes("cancelled") || statusLower.includes("failed")) {
      return <FiX className="text-red-500" />;
    } else {
      return <FiClock className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Orders</h1>
          
          {/* Filters and Search */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search by invoice number, customer name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-900 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 rounded-md text-white">
                  Search
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-900 rounded-lg border border-gray-800 focus:outline-none appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="Not Delivered">Not Delivered</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  className="w-full px-4 py-3 pl-10 bg-gray-900 rounded-lg border border-gray-800 focus:outline-none appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Orders List */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Invoice #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Items
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <FiRefreshCw className="animate-spin text-2xl mb-2" />
                          <span>Loading orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-red-400">
                        <div>{error}</div>
                        <button 
                          onClick={handleRefresh}
                          className="mt-2 px-4 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700"
                        >
                          Try Again
                        </button>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                        <div>No orders found</div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-blue-400">{order.invoiceNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                              <FiUser />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{order.customer?.name || "Guest"}</p>
                              <p className="text-xs text-gray-400">{order.customer?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {order.formattedDate || 
                            (order.date && new Date(order.date.seconds * 1000).toLocaleDateString())}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-300">
                          {order.items?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className="font-medium text-white">₹{order.totalAmount?.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            bg-opacity-10 border">
                            <span className="mr-1">{getStatusIcon(order.deliveryStatus)}</span>
                            <span>
                              {order.deliveryStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedInvoice(order)}
                            className="p-2 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                          >
                            <FiEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Load More */}
            {hasMore && orders.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-800 text-center">
                <button
                  onClick={loadMoreOrders}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <OrderInvoiceDetail 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default AdminOrders;