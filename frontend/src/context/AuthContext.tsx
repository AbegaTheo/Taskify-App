// ✅ src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";

// Définition du type de User
export interface User {
  _id: string;
  email: string;
  username?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonctions utilitaires
const getUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    
    if (!stored || stored === "undefined" || stored === "null") {
      console.log("🔍 Aucun utilisateur valide dans localStorage");
      return null;
    }
    
    const parsed = JSON.parse(stored);
    console.log("✅ Utilisateur récupéré depuis localStorage:", parsed);
    return parsed;
  } catch (error) {
    console.error("❌ Erreur lors du parsing du user:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token || token === "undefined" || token === "null") {
      console.log("🔍 Aucun token valide dans localStorage");
      return null;
    }
    
    console.log("✅ Token récupéré depuis localStorage");
    return token;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du token:", error);
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialiser depuis localStorage
  useEffect(() => {
    console.log("🔄 Initialisation AuthContext...");
    
    const storedUser = getUserFromStorage();
    const storedToken = getTokenFromStorage();
    
    console.log("🔍 Données récupérées:", { storedUser, storedToken });
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      console.log("✅ Utilisateur restauré avec succès");
    } else {
      console.log("ℹ️ Aucune session utilisateur trouvée");
    }
    
    setLoading(false);
  }, []);

  // ✅ Fonction login corrigée
  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Tentative de connexion pour:", email);
      
      const res = await axios.post("http://localhost:5000/api/auth/login", { 
        email, 
        password 
      });
      
      console.log("✅ Réponse du serveur (login):", res.data);
      
      // ✅ CORRECTION : Supprimer otherData non utilisé
      const { token: authToken, user: userData } = res.data;
      
      let finalUser = userData;
      
      // Si pas d'objet user séparé, construire à partir des données directes
      if (!userData && res.data._id) {
        finalUser = {
          _id: res.data._id,
          email: res.data.email,
          username: res.data.username,
          role: res.data.role,
        };
      } 
      
      console.log("🔍 Données finales:", { token: authToken, user: finalUser });
      
      if (authToken && finalUser?._id) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(finalUser));
        
        setToken(authToken);
        setUser(finalUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        
        console.log("✅ Connexion réussie");
      } else {
        throw new Error("Données de connexion incomplètes");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error);
      throw error;
    }
  };

  // ✅ Fonction register corrigée
  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      console.log("🔄 Inscription en cours...", { username, email });
      
      const res = await axios.post("http://localhost:5000/api/auth/register", { 
        username, 
        email, 
        password, 
        confirmPassword 
      });
      
      console.log("✅ Réponse du serveur (register):", res.data);
      
      // ✅ CORRECTION : Construire l'objet user à partir de la réponse directe
      const { token: authToken, message, ...userData } = res.data;
      
      const user = {
        _id: userData._id,
        email: userData.email,
        username: userData.username,
        name: userData.name
      };
      
      console.log("🔍 Token:", authToken);
      console.log("🔍 User construit:", user);
      
      if (authToken && user._id) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        setToken(authToken);
        setUser(user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        
        console.log("✅ Inscription et connexion automatique réussies");
      } else {
        console.error("❌ Données manquantes:", { token: !!authToken, userId: user._id });
        throw new Error("Données d'inscription incomplètes");
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  // Déconnexion
  const logout = useCallback(() => {
    console.log("🚪 Déconnexion en cours...");
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setToken(null);
    setUser(null);
    
    delete axios.defaults.headers.common["Authorization"];
    
    console.log("✅ Déconnexion terminée");
  }, []);

  const isAuthenticated = !!(user && token);

  useEffect(() => {
    console.log("🔍 État AuthContext:", { 
      user: user ? user.email : "non connecté", 
      token: token ? "présent" : "absent",
      isAuthenticated,
      loading 
    });
  }, [user, token, isAuthenticated, loading]);

  if (loading) {
    return <div className="loading">Chargement de l'utilisateur...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
