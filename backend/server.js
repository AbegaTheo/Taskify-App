// backend/server.js

import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/TaskRoutes.js";
import AuthRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// Connexion à la base de données
connectDB();

// Configuration de Express
const app = express();

// Middleware
app.use(cors({
  origin: "https://taskify-backend-6dkg.onrender.com",
  credentials: true
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center; margin-top: 200px;'>🚀 API Taskify est en ligne</h1>"
  );
});

app.use("/api/tasks", taskRoutes); // Utilisez '/api/tasks' pour les routes de tâches
app.use("/api/auth", AuthRoutes); // Utilisez '/api/auth' pour les routes d'authentification

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Middleware d'erreur
app.use(errorHandler);

// Lancement du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("****************************************************************************");
  console.log(
    `✅ Serveur en ligne sur le port http://localhost:${port}`.cyan.bold.italic
  );
  console.log("****************************************************************************");
});
