import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}api/orders/admin/all`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };
  
  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(`${backendUrl}api/orders/admin/${orderId}`);
      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Failed to fetch order details. Please try again.");
    }
  };
  
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      const response = await axios.put(
        `${backendUrl}api/orders/admin/${orderId}/status?status=${newStatus}`
      );
      
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
    
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      setStatusUpdating(false);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
      setStatusUpdating(false);
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatDate = (dateArray) => {
   
    if (Array.isArray(dateArray)) {
      
      const [year, month, day, hour, minute, second] = dateArray;
      
      const date = new Date(year, month - 1, day, hour, minute, second);
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } 
   
    else if (typeof dateArray === 'string') {
      const date = new Date(dateArray);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    
  
    return "Date unavailable";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Oops!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {error}
          </p>
          <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            All Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Order ID</th>
                <th className="py-3 px-4 text-left font-medium">Customer</th>
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="py-3 px-4">
                      ${order.orderTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="text-green-600 hover:text-green-800 transition-colors mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{selectedOrder.id} Details
              </h3>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Name: {selectedOrder.firstName} {selectedOrder.lastName}
                    </p>
                    <p>
                      Email: {selectedOrder.email}
                    </p>
                    <p>
                      User ID: {selectedOrder.userId}
                    </p>
                    <p>
                      User Email: {selectedOrder.userEmail}
                    </p>
                    <p>
                      Contact: {selectedOrder.contactNo}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Shipping Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Address: {selectedOrder.street}
                    </p>
                    <p>
                      City: {selectedOrder.city}
                    </p>
                    <p>
                      State: {selectedOrder.state}
                    </p>
                    <p>
                      ZIP Code: {selectedOrder.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Order Status
                  </h4>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">Current Status:</span> 
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <p>
                        Order Date: {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="mr-2 text-sm font-medium">
                        Update Status:
                      </label>
                      <select 
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                        value={selectedOrder.status}
                        disabled={statusUpdating}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      
                      {statusUpdating && (
                        <div className="ml-2 animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-4">
                    Order Details
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Item
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Price
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Quantity
                          </th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 px-4 text-sm">
                              {item.itemName}
                            </td>
                            <td className="py-2 px-4 text-sm">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 text-sm">
                              {item.quantity}
                            </td>
                            <td className="py-2 px-4 text-sm">
                              ${item.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 space-y-2 text-right">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${selectedOrder.itemsTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${selectedOrder.shippingCharges.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>${selectedOrder.orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 text-right">
                <button 
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;