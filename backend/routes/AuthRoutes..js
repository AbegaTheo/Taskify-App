const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Route POST pour inscrire un nouvel utilisateur
router.post("/register", registerUser);

// Route POST pour authentifier un utilisateur
router.post("/login", loginUser);

// Route GET pour récupérer les informations de l'utilisateur connecté
router.get("/profile", protect, getUserProfile);

module.exports = router;