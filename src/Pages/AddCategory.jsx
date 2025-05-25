import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddCategory = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    
    setLoading(true);
    try {
      const categoryData = {
        name,
        description,
      };
      
      const formData = new FormData();
      formData.append("category", JSON.stringify(categoryData));
      if (image) formData.append("image", image);
      
      console.log("Submitting category data:", categoryData);
      
      const response = await axios.post(
        `${backendUrl}api/categories/add-category`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success("Category Added Successfully");
        setName('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
      } else {
        toast.error(response.data.message || "Error in Category Adding");
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
          src={!imagePreview ? assets.upload_area : imagePreview}
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
    <div className="p-6 min-h-screen bg-gradient-to-br">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-green-200">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Add New Category</h2>
        <div className="mb-6">
          <p className="text-green-700 mb-2 font-medium">Upload Image</p>
          {renderImagePreview()}
        </div>
        <div className="mb-4">
          <p className="text-green-700 mb-2 font-medium">Category Name *</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Add Category Name"
            required
          />
        </div>
        <div className="mb-6">
          <p className="text-green-700 mb-2 font-medium">Category Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="Add Description Here"
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-green-700 text-white py-3 rounded-md font-semibold hover:bg-green-800 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={onSubmitHandler}
          disabled={loading}
        >
          {loading ? "ADDING CATEGORY..." : "ADD CATEGORY"}
        </button>
      </div>
    </div>
  );
};

export default AddCategory;