import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Vérifie le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Injecte les données utilisateur (sans mot de passe)
      req.user = await Users.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non trouvé 🚫" });
      }

      // ✅ Autorisation confirmée
      return next();
    } catch (error) {
      console.error("❌ Erreur dans le middleware protect:", error.message);
      return res.status(401).json({ message: "Token invalide ou expiré 🚫" });
    }
  }

  // ✅ Aucun token envoyé
  console.warn("🔒 Aucun token dans l'en-tête Authorization");
  return res.status(401).json({ message: "Pas de token, accès refusé 🚫" });
};

export { protect };
