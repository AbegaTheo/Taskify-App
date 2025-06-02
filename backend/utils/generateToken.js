const jwt = require("jsonwebtoken"); // importation de jsonwebtoken pour la generation du token

// generation du token
const generateToken = (id) => {
    // generation du token avec l'id de l'utilisateur et la clé secrète
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // expiration du token en 30 jours
    });
};

module.exports = generateToken; // exportation de la fonction generateToken