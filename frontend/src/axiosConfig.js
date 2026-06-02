import axios from 'axios';

// Configure axios with proper baseURL
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = baseURL;

// Add request interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios;
