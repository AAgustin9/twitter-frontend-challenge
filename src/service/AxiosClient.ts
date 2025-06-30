import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 
                "https://twitter-ieea.onrender.com/api";

const axiosClient = axios.create({
    baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = token;
    }
    return config;
});

export default axiosClient;