import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy handles the rest
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (401, 403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Only redirect if not already on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                 // Clear token and redirect
                 localStorage.removeItem('token');
                 localStorage.removeItem('user');
                 window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
