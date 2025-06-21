import express from "express";

import {
  getTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
  filterTasks,
} from "../controllers/tasksController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  validateTask,
  validateTaskUpdate,
} from "../middleware/taskValidation.js";

import { verifyTaskOwnership } from "../middleware/taskProprio.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

// Routes principales
router.get("/", getTasks); // GET /api/tasks - Obtenir toutes les tâches
router.post("/", validateTask, handleValidationErrors, createTask); // POST /api/tasks - Créer une nouvelle tâche

// Routes de filtrage
router.get("/filter", verifyTaskOwnership, filterTasks); // GET /api/tasks/filter - Filtrer les tâches

// Routes spécifiques à une tâche
router.put(
  "/:id",
  verifyTaskOwnership,
  validateTaskUpdate,
  handleValidationErrors,
  updateTask
); // PUT /api/tasks/:id - 🔄 Mettre à jour une tâche

router.delete("/:id", verifyTaskOwnership, deleteTask); // DELETE /api/tasks/:id - 🗑️ Supprimer une tâche
router.get("/:id", verifyTaskOwnership, getSingleTask); // GET /api/tasks/:id - Obtenir une tâche spécifique

export default router;
