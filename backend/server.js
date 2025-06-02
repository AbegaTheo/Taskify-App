// backend/server.js

const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const TasksRoutes = require("./routes/TasksRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API est en ligne !");
});

app.use("/api/tasks", TasksRoutes);

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connexion à MongoDB Réussie !".green.bold);
}).catch((error) => {
  console.error("❌ Erreur lors de la connexion à MongoDB :".red.bold, error);
});

// Lancement du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur le port http://localhost:${port}`);
});