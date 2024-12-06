import axios from 'axios';

const API_URL = '/api'; 
// Note: Since we are serving frontend and backend from the same host,
// we can use relative `/api`.
// If deployed separately, you'd put the full URL, e.g. 'https://your-backend.onrender.com/api'

export const fetchSuppliers = () => axios.get(`${API_URL}/suppliers`);
export const updateSupplier = (id, data) => axios.put(`${API_URL}/suppliers/${id}`, data);
export const addSupplier = (data) => axios.post(`${API_URL}/suppliers`, data);
