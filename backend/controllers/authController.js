const Users = require("../models/Users");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Fonction pour créer un nouvel utilisateur
// @route POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Vérification des champs obligatoires
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérification si l'utilisateur existe déjà
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    if(user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        message: "L'utilisateur a été créé avec succès.",
      });
    } else {
      res.status(400).json({ message: "Données de l'utilisateur invalides." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la création de l'utilisateur.", error: error.message });
  }
};

// Fonction pour authentifier un utilisateur
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérification si l'utilisateur existe
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "L'utilisateur n'existe pas." });
    }

    // Vérification du mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "Connexion reussie !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion de l'utilisateur.", error: error.message });
  }
};

// Fonction pour récupérer les informations de l'utilisateur connecté
// @route GET /api/auth/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).select("-password");

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: "L'utilisateur n'existe pas." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la recherche de l'utilisateur.", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};