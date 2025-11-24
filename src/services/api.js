import axios from "axios";

const api = axios.create({
    baseURL: "https://necessary-agna-akbarovasadbek777-c512a1db.koyeb.app/movie",  // Kompyuterning real IP manzili
    timeout: 5000,
});

// Error interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API ERROR:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
