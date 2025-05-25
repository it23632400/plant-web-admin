import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaLeaf, FaPlus, FaSearch } from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}api/categories`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    description: '',
  });
  const [updateImage, setUpdateImage] = useState(null);
  const [updateImagePreview, setUpdateImagePreview] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/all`);
  
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Expected array but got:', response.data);
        setCategories([]);
        setError('Received invalid data format from server.');
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.');
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      showNotification(`Error fetching category: ${err.message}`, 'error');
      console.error('Error fetching category:', err);
      return null;
    }
  };

  const updateCategory = async (id, categoryData, image) => {
    try {
      const formData = new FormData();
      formData.append('category', JSON.stringify(categoryData));
      
      if (image) {
        formData.append('image', image);
      }
      
      const response = await axios.put(`${API_URL}/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateClick = (category) => {
    setSelectedCategory(category);
    setUpdateFormData({
      name: category.name,
      description: category.description,
    });
    setUpdateImagePreview(category.imageBase64 || '');
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateImage(file);
      

      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdateImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: updateFormData.name,
        description: updateFormData.description,
      };
      
      const response = await updateCategory(selectedCategory.id, categoryData, updateImage);

      if (response.success) {
        showNotification('Category updated successfully!', 'success');
        fetchCategories();
        setShowUpdateModal(false);
      } else {
        showNotification(`Update failed: ${response.message}`, 'error');
      }
    } catch (err) {
      showNotification(`Error updating category: ${err.message}`, 'error');
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await deleteCategory(selectedCategory.id);
      
      if (response.success) {
        showNotification('Category deleted successfully!', 'success');
        fetchCategories();
        setShowDeleteModal(false);
      } else {
        showNotification(`Deletion failed: ${response.message}`, 'error');
      }
    } catch (err) {
      showNotification(`Error deleting category: ${err.message}`, 'error');
      console.error('Error deleting category:', err);
    }
  };

  
  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(category =>
        category && category.name && category.description &&
        (category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
    
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

     
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <FaLeaf className="text-green-600 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
          </div>
          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <a 
              href="/admin/add-category" 
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300"
            >
              <FaPlus className="mr-2" /> Add New
            </a>
          </div>
        </div>
      </div>

  
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>No categories found. {searchTerm ? 'Try a different search term.' : 'Add some categories to get started!'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-green-50 transition-colors duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.imageBase64 ? (
                            <img 
                              src={category.imageBase64} 
                              alt={category.name} 
                              className="h-16 w-16 object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                              <FaLeaf className="text-gray-400 text-2xl" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 max-w-xs truncate">{category.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateClick(category)}
                              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors duration-300"
                              title="Edit Category"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-300"
                              title="Delete Category"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

 
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Update Category</h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updateFormData.name}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={updateFormData.description}
                    onChange={handleUpdateChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {updateImagePreview && (
                      <img
                        src={updateImagePreview}
                        alt="Category preview"
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    )}
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete the category "<span className="font-semibold">{selectedCategory?.name}</span>"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;