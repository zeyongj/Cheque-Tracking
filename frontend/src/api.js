import axios from 'axios';

const API_URL = '/api';

export const fetchSuppliers = () => axios.get(`${API_URL}/suppliers`);
export const updateSupplier = (id, data) => axios.put(`${API_URL}/suppliers/${id}`, data);
export const addSupplier = (data) => axios.post(`${API_URL}/suppliers`, data);
