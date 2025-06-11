// api.js
import { LOCAL_STORAGE } from "@/utils/constants";
import axios from "axios";

// const baseURL =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000"
//     : "https://wrc-db.hughberryman.com/";

const baseURL = "http://localhost:3000"

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adds JWT to request header if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE.JWT_TOKEN);

        if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.log("err from token interceptor", error);
        return Promise.reject(error);
    }
);

export default api;