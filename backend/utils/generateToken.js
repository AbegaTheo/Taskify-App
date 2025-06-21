import jwt from 'jsonwebtoken'; // importation de jsonwebtoken pour la génération du token

// generation du token
const generateToken = (id) => {
    // generation du token avec l'id de l'utilisateur et la clé secrète
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // expiration du token en 24 heures
    });
};

export default generateToken; // exportation de la fonction generateToken