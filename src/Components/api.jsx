import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const API_URL = `${backendUrl}api`;

const api = {
  
  getAllItems: () => axios.get(`${API_URL}/items/get-items`),
  getItemById: (id) => axios.get(`${API_URL}/items/get/${id}`),
  addItem: (formData) => axios.post(`${API_URL}/items/add-item`, formData),
  deleteItem: (id) => axios.delete(`${API_URL}/items/delete/${id}`),
};

export default api;