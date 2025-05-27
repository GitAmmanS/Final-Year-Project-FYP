import axios from "axios";
import { BaseUrl } from "./BaseUrl";
export const axiosInstance = axios.create({
    baseURL: BaseUrl
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        Promise.reject(error);
    }
)
