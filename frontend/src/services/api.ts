// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Interceptor pour ajouter le token dans les headers
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const token = parsedUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de réponse pour capturer les erreurs globales
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ❌ Token invalide ou expiré : on peut trigger un logout global ici si on a accès au contexte
      console.warn("Token expiré ou non valide. Déconnexion...");
      localStorage.removeItem("user");
      // window.location.href = "/"; // ou déclencher un logout via contexte (mieux)
    }
    return Promise.reject(error);
  }
);

export default API;
