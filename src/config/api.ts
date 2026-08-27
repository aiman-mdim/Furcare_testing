const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://furcare-t4fp.onrender.com");

export default API_BASE_URL;
