import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddItems = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}api/categories/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      toast.error("Name, price and quantity are required");
      return;
    }
    setLoading(true);
    try {
      const itemData = {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
      };
      
      const formData = new FormData();
      formData.append("item", JSON.stringify(itemData));
      if (image) formData.append("image", image);
      
      console.log("Submitting item data:", itemData);
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      const response = await axios.post(
        `${backendUrl}api/items/add-item`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success("Product Added Successfully");
        setName('');
        setDescription('');
        setImage(null);
        setPrice('');
        setQuantity('');
        setCategory('');
      } else {
        toast.error(response.data.message || "Error in Product Adding");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        toast.error(error.response.data?.message || `Error (${error.response.status}): ${error.message}`);
      } else if (error.request) {
        toast.error("No response from server. Please check if the server is running.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderImagePreview = () => {
    return (
      <label
        htmlFor="image"
        className="w-32 h-32 border-4 border-dashed border-green-400 bg-green-50 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-600 transition overflow-hidden"
      >
        <img
          className="w-full h-full object-cover rounded-lg"
          src={!image ? assets.upload_area : URL.createObjectURL(image)}
          alt="Upload"
        />
        <input
          onChange={handleImageChange}
          type="file"
          id="image"
          accept="image/*"
          hidden
        />
      </label>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br ">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-green-200">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Add New Product</h2>
        <div className="mb-6">
          <p className="text-green-700 mb-2 font-medium">Upload Image</p>
          {renderImagePreview()}
        </div>
        <div className="mb-4">
          <p className="text-green-700 mb-2 font-medium">Product Name *</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Add Name Here"
            required
          />
        </div>
        <div className="mb-4">
          <p className="text-green-700 mb-2 font-medium">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="Add Description Here"
          />
        </div>
        <div className="mb-4">
          <p className="text-green-700 mb-2 font-medium">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a category</option>
            {fetchingCategories ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-green-700 mb-2 font-medium">Product Quantity *</p>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              type="number"
              placeholder="Add Quantity Here"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <p className="text-green-700 mb-2 font-medium">Product Price *</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              type="number"
              placeholder="Add Price Here"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full bg-green-700 text-white py-3 rounded-md font-semibold hover:bg-green-800 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={onSubmitHandler}
          disabled={loading}
        >
          {loading ? "ADDING ITEM..." : "ADD ITEM"}
        </button>
      </div>
    </div>
  );
};

export default AddItems;