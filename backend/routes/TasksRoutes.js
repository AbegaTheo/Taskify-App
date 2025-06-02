const  express = require("express");
const router = express.Router();
const Tasks = require("../models/Tasks");
const { protect } = require("../middleware/authMiddleware");

// Route GET pour récupérer toutes les tâches
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la recherche des tâches." });
  }
});

// route de test
router.get("/tasks/test", (req, res) => {
  res.send("API est en ligne ✅!");
});

router.get('/', protect, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.username}, voici vos tâches.` });
});

// Route POST pour créer une nouvelle tâche
router.post("/tasks/new", async (req, res) => {
  const { title, description, status, priority, createdAt, owner } = req.body;
  try {
    const newTask = new Tasks({ title, description, status: "En Attente", priority: "Moyenne", createdAt: Date.now(), owner: req.user._id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la création de la tâche." });
  }
});

module.exports = router;