import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/items/get-items`);
        const processedProducts = response.data.map(product => ({
          ...product,
        
          image1: product.image 
            ? product.image.startsWith('data:image') 
              ? product.image 
              : `data:image/jpeg;base64,${product.image}`
            : '/images/product.png'
        }));
        setProducts(processedProducts);
        setOriginalProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value === '') {
      setProducts(originalProducts);
    } else {
      const filteredProducts = originalProducts.filter(product =>
        product.name.toLowerCase().includes(value) ||
        (product.description && product.description.toLowerCase().includes(value))
      );
      setProducts(filteredProducts);
    }
  };

  const handleRemoveProduct = async (itemId) => {
    try {
      const res = await axios.delete(`${backendUrl}api/items/delete/${itemId}`);
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Product deleted successfully");
       
        const response = await axios.get(`${backendUrl}/api/items/get-items`);
        const processedProducts = response.data.map(product => ({
          ...product,
         
          image1: product.image 
            ? product.image.startsWith('data:image') 
              ? product.image 
              : `data:image/jpeg;base64,${product.image}`
            : '/images/product.png'
        }));
        setProducts(processedProducts);
        setOriginalProducts(processedProducts);
      } else {
        toast.error(res.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || "An error occurred while deleting the product");
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Product List</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.itemId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/product.png';
                    }}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.description || '-'}</td>
                <td className="px-4 py-3">{product.quantity}</td>
                <td className="px-4 py-3">${product.price}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemoveProduct(product.itemId)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-4 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;