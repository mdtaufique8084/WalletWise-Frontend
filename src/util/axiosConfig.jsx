import axios from "axios";
import { BASE_URL } from "./apiEndPoints";

const axiosConfig = axios.create({
    baseURL:BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// list of endpoints that do not require authorization header
const excludeEndpoints = [
    "/profile/login", "/profile/register", "/status", "/health", "/profile/activate"
];

// Request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        const shouldSkipToken = excludeEndpoints.some((endpoint) => 
            config.url?.includes(endpoint)
        );

        if (!shouldSkipToken) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error, please try again later");
            } else if (error.code === "ECONNABORTED") {
                console.error("Request timeout, please try again");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;
