const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Users.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Non autorisé, Token non valide." });
    }
  }

  if (!token) {
      res.status(401).json({ message: "Pas de token, autorisation refusée." });
  }
  };

  module.exports = { protect };