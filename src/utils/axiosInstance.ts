import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create();

// Set up an interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem("access_token"); // Or another method to retrieve the token

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
