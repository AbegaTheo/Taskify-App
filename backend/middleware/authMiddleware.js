import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    
    try {
      // récupérer le token du header
      token = req.headers.authorization.split(" ")[1];
      // vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      /// récupérer l'utilisateur associé au token
      req.user = await Users.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Non autorisé, Token invalide ou expiré 🚫" });
    }
  }

  if (!token) {
      return res.status(401).json({ message: "Pas de token, accès refusé 🚫" });
  }
  };

  export { protect };