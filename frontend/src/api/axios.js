// import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000" });

// API.interceptors.request.use((req) => {
//     req.headers.Authorization = `Bearer ${localStorage.getItem("token") || ""}`;
//     return req;
// });

// export default API;

import axios from "axios";

// Determine base URL depending on environment
const isLocalhost = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000"
    : "https://e-advertisement-backend.onrender.com",
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token") || ""}`;
  return req;
});

export default API;
