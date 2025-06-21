import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//@route POST '/api/auth/register' Route POST pour inscrire un nouvel utilisateur
router.post("/register", registerUser);

//@route POST '/api/auth/login' Route POST pour authentifier un utilisateur
router.post("/login", loginUser);

//@route GET '/api/auth/profile' Route GET pour récupérer les informations de l'utilisateur connecté
router.get("/profile", protect, getUserProfile);

// Route GET pour tester l'authentification
router.get('/', (req, res) => {
  res.send('Auth route fonctionne ✅');
});

export default router;