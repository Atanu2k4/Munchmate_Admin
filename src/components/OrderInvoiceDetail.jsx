import React, { useState, useEffect } from "react";
import { FiDownload, FiPrinter, FiTruck, FiCheck, FiClock, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

const OrderInvoiceDetail = ({ invoice, onClose }) => {
  const [deliveryStatusColor, setDeliveryStatusColor] = useState("yellow");
  const [deliveryIcon, setDeliveryIcon] = useState(<FiTruck />);

  useEffect(() => {
    // Set status color and icon based on delivery status
    if (invoice.deliveryStatus) {
      const status = invoice.deliveryStatus.toLowerCase();
      
      if (status.includes("delivered") || status.includes("completed")) {
        setDeliveryStatusColor("green");
        setDeliveryIcon(<FiCheck />);
      } else if (status.includes("failed") || status.includes("cancelled")) {
        setDeliveryStatusColor("red");
        setDeliveryIcon(<FiX />);
      } else if (status.includes("progress") || status.includes("transit")) {
        setDeliveryStatusColor("blue");
        setDeliveryIcon(<FiTruck />);
      } else {
        setDeliveryStatusColor("yellow");
        setDeliveryIcon(<FiClock />);
      }
    }
  }, [invoice.deliveryStatus]);

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownload = () => {
    // In a production app, this would use jsPDF or another library
    alert("In a real app, this would generate a PDF for download");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-black px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Invoice {invoice.invoiceNumber}</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <FiPrinter size={20} />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <FiDownload size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div id="invoice-content" className="p-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-100 mr-3">INVOICE</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${deliveryStatusColor}-500/20 text-${deliveryStatusColor}-500 flex items-center`}>
                  {deliveryIcon}
                  <span className="ml-1">{invoice.deliveryStatus}</span>
                </span>
              </div>
              <p className="text-gray-400">{invoice.invoiceNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="font-bold text-gray-300">Date:</p>
              <p className="text-gray-400">{invoice.formattedDate}</p>
              {invoice.paymentId && (
                <p className="text-gray-400 text-sm mt-1">Payment ID: {invoice.paymentId}</p>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h2 className="font-bold text-gray-300 mb-2">From:</h2>
              <p className="text-gray-400">MunchMate</p>
              <p className="text-gray-400">123 Campus Street</p>
              <p className="text-gray-400">College Food Services</p>
              <p className="text-gray-400">support@munchmate.edu</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="font-bold text-gray-300 mb-2">To:</h2>
              <p className="text-gray-400">{invoice.customer?.name || "Guest Customer"}</p>
              {invoice.customer?.rollNumber && (
                <p className="text-gray-400">Roll No: {invoice.customer.rollNumber}</p>
              )}
              {invoice.customer?.department && (
                <p className="text-gray-400">{invoice.customer.department}</p>
              )}
              {(invoice.customer?.section || invoice.customer?.semester) && (
                <p className="text-gray-400">
                  {invoice.customer.section && `Section: ${invoice.customer.section}`}
                  {invoice.customer.section && invoice.customer.semester && ', '}
                  {invoice.customer.semester && invoice.customer.semester}
                </p>
              )}
              <p className="text-gray-400">{invoice.customer?.email}</p>
              {invoice.customer?.contactNumber && (
                <p className="text-gray-400">Contact: {invoice.customer.contactNumber}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-2 text-gray-300">Item</th>
                  <th className="text-center py-3 px-2 text-gray-300">Quantity</th>
                  <th className="text-right py-3 px-2 text-gray-300">Price</th>
                  <th className="text-right py-3 px-2 text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 px-2 text-gray-300">{item.name}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-300">₹{item.price.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-gray-300">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-300">Subtotal:</span>
                <span className="text-gray-300">₹{invoice.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-300">Tax ({invoice.tax ? (invoice.tax * 100).toFixed() : '0'}%):</span>
                <span className="text-gray-300">₹{(invoice.tax ? invoice.subtotal * invoice.tax : 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-800 font-bold">
                <span className="text-gray-200">Total:</span>
                <span className="text-gray-100">₹{invoice.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QR Code if payment ID exists */}
          {invoice.paymentId && (
            <div className="mt-8 flex justify-center">
              <div className="p-4 bg-white rounded">
                <QRCode value={invoice.paymentId} size={128} />
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-300 mb-2">Delivery Status</h3>
                <div className={`p-4 rounded-lg bg-${deliveryStatusColor}-500/10 border border-${deliveryStatusColor}-500/30`}>
                  <div className="flex items-center">
                    {deliveryIcon}
                    <span className={`ml-2 text-${deliveryStatusColor}-500 font-medium`}>
                      {invoice.deliveryStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">
                    {invoice.deliveryStatus === "Not Delivered" && "Your order is being prepared."}
                    {invoice.deliveryStatus === "In Transit" && "Your order is on the way."}
                    {invoice.deliveryStatus === "Delivered" && "Your order has been delivered."}
                    {invoice.deliveryStatus === "Cancelled" && "This order has been cancelled."}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-300 mb-2">Order Actions</h3>
                <div className="space-y-2">
                  <button
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                    onClick={() => alert("Order status update would happen here")}
                  >
                    Update Status
                  </button>
                  <button
                    className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                    onClick={() => alert("Contact customer action would happen here")}
                  >
                    Contact Customer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>Invoice generated by MunchMate Admin System</p>
            <p className="mt-1">For support, contact admin@munchmate.edu</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderInvoiceDetail;