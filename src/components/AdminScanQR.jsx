import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config"; // Assuming you have a firebase config file
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiSearch,
  FiPackage,
} from "react-icons/fi";
import AdminNavbar from "../components/AdminNav"; // Import your Navbar

const AdminScanQR = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      await fetchInvoiceData(invoiceId.trim());
    } catch (err) {
      setError("Failed to fetch invoice data: " + err.message);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceData = async (searchValue) => {
    // Create a query to find invoices by invoiceNumber field
    const invoicesRef = collection(db, "invoices");
    const q = query(invoicesRef, where("invoiceNumber", "==", searchValue));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching invoice
      const invoiceDoc = querySnapshot.docs[0];
      setInvoice({ id: invoiceDoc.id, ...invoiceDoc.data() });
    } else {
      throw new Error("Invoice not found");
    }
  };

  const markAsDelivered = async () => {
    if (!invoice || !invoice.id) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      // Reference to the invoice document
      const invoiceRef = doc(db, "invoices", invoice.id);

      // Update the invoice status to "Delivered"
      await updateDoc(invoiceRef, {
        orderStatus: "Delivered",
        deliveredAt: new Date(),
      });

      // Update the local state
      setInvoice((prev) => ({
        ...prev,
        orderStatus: "Delivered",
        deliveredAt: new Date(),
      }));

      setSuccessMessage("Order has been marked as delivered!");
    } catch (err) {
      setError("Failed to update order status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const resetSearch = () => {
    setInvoice(null);
    setError(null);
    setSuccessMessage(null);
    setInvoiceId("");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Convert Firestore timestamp to JS Date
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return String(timestamp);
    }
  };

  const isOrderDeliverable = () => {
    // Check if order can be marked as delivered
    // Only allow delivery if order is not already delivered
    return invoice && invoice.orderStatus !== "Delivered";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <AdminNavbar />

      <div className="container mx-auto pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 border-b border-purple-500 pb-2 text-purple-300">
            Invoice Lookup
          </h1>

          {!invoice ? (
            <>
              {/* Manual Invoice Entry */}
              <div className="bg-slate-900/80 p-6 rounded-lg border border-indigo-500/30 mb-6 shadow-lg shadow-purple-900/20">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">
                  Enter Invoice Number
                </h2>
                <form onSubmit={handleManualSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder="Enter invoice number (e.g. INV-0001)..."
                    className="flex-1 bg-slate-800 border border-indigo-500/30 rounded-md px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:from-purple-700 hover:to-indigo-700 transition flex items-center shadow-md shadow-purple-900/30"
                  >
                    <FiSearch className="mr-2" />
                    Search
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/80 p-6 rounded-lg border border-indigo-500/30 shadow-lg shadow-purple-900/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Invoice:{" "}
                  <span className="text-cyan-400">{invoice.invoiceNumber}</span>
                </h2>
                <button
                  onClick={resetSearch}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:from-purple-700 hover:to-indigo-700 transition shadow-md shadow-purple-900/30"
                >
                  Search Again
                </button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="mt-4 text-indigo-300">
                    Fetching invoice data...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/30 border border-red-400 p-4 rounded-md flex items-center">
                  <FiAlertTriangle className="text-red-400 mr-3 text-xl" />
                  <p>{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-900/30 border border-emerald-400 p-4 rounded-md flex items-center mb-4">
                  <FiCheckCircle className="text-emerald-400 mr-3 text-xl" />
                  <p>{successMessage}</p>
                </div>
              )}

              {invoice && (
                <div className="mt-4">
                  <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-md flex items-center mb-6">
                    <FiCheckCircle className="text-emerald-400 mr-3 text-xl" />
                    <p>Invoice found! Displaying details below.</p>
                  </div>

                  {/* Order Action Button */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-800/50 p-4 rounded-md border border-indigo-500/20">
                      <div className="mb-3 sm:mb-0">
                        <h3 className="font-bold text-cyan-400">
                          Order Status
                        </h3>
                        <div className="flex items-center mt-1">
                          <span
                            className={`px-3 py-1 rounded ${
                              invoice.orderStatus === "Delivered"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : invoice.orderStatus === "Processing"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {invoice.orderStatus || "Pending"}
                          </span>
                          {invoice.deliveredAt && (
                            <span className="text-xs text-gray-400 ml-2">
                              ({formatDate(invoice.deliveredAt)})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={markAsDelivered}
                        disabled={!isOrderDeliverable() || updating}
                        className={`px-4 py-2 rounded-md flex items-center ${
                          isOrderDeliverable() && !updating
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-900/30"
                            : "bg-slate-700 cursor-not-allowed opacity-60"
                        } transition`}
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiPackage className="mr-2" />
                            Mark Order as Delivered
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-slate-800/50 p-4 rounded-md border border-indigo-500/20">
                      <h3 className="text-lg font-bold mb-3 text-cyan-400">
                        Customer Information
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-indigo-300 text-sm">Name:</span>
                          <p>{invoice.customer?.name || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Contact:
                          </span>
                          <p>{invoice.customer?.contactNumber || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Department:
                          </span>
                          <p>{invoice.customer?.department || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Email:
                          </span>
                          <p className="text-cyan-300">
                            {invoice.customer?.email || "N/A"}
                          </p>
                        </div>
                        {invoice.customer?.rollNumber && (
                          <div>
                            <span className="text-indigo-300 text-sm">
                              Roll Number:
                            </span>
                            <p>{invoice.customer.rollNumber}</p>
                          </div>
                        )}
                        {invoice.customer?.section && (
                          <div>
                            <span className="text-indigo-300 text-sm">
                              Section:
                            </span>
                            <p>{invoice.customer.section}</p>
                          </div>
                        )}
                        {invoice.customer?.semester && (
                          <div>
                            <span className="text-indigo-300 text-sm">
                              Semester:
                            </span>
                            <p>{invoice.customer.semester}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Invoice Information */}
                    <div className="bg-slate-800/50 p-4 rounded-md border border-indigo-500/20">
                      <h3 className="text-lg font-bold mb-3 text-cyan-400">
                        Invoice Details
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Invoice Number:
                          </span>
                          <p>{invoice.invoiceNumber}</p>
                        </div>
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Invoice ID:
                          </span>
                          <p className="text-xs text-gray-400">{invoice.id}</p>
                        </div>
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Created:
                          </span>
                          <p>{formatDate(invoice.createdAt)}</p>
                        </div>

                        {invoice.paymentId && (
                          <div>
                            <span className="text-indigo-300 text-sm">
                              Payment ID:
                            </span>
                            <p>{invoice.paymentId}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-indigo-300 text-sm">
                            Total Amount:
                          </span>
                          <p className="text-xl font-bold text-purple-300">
                            ₹{invoice.totalAmount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {invoice.items && invoice.items.length > 0 && (
                    <div className="mt-6 bg-slate-800/50 p-4 rounded-md border border-indigo-500/20">
                      <h3 className="text-lg font-bold mb-3 text-cyan-400">
                        Ordered Items
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-slate-900/80 text-left border-b border-indigo-500/30">
                              <th className="py-3 px-4 text-sm text-indigo-300">
                                Item
                              </th>
                              <th className="py-3 px-4 text-sm text-indigo-300">
                                Price
                              </th>
                              <th className="py-3 px-4 text-sm text-indigo-300">
                                Quantity
                              </th>
                              <th className="py-3 px-4 text-sm text-indigo-300">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.items.map((item, index) => (
                              <tr
                                key={item.id || index}
                                className="border-t border-indigo-500/10 hover:bg-indigo-900/10 transition"
                              >
                                <td className="py-3 px-4">{item.name}</td>
                                <td className="py-3 px-4">₹{item.price}</td>
                                <td className="py-3 px-4">{item.quantity}</td>
                                <td className="py-3 px-4">
                                  ₹{item.subtotal || item.price * item.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <div className="bg-slate-900/80 p-3 rounded-md w-48 border border-indigo-500/20">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{invoice.subtotal || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span>Tax:</span>
                            <span>₹{invoice.tax || 0}</span>
                          </div>
                          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-indigo-500/30">
                            <span>Total:</span>
                            <span className="text-purple-300">
                              ₹{invoice.totalAmount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScanQR;
