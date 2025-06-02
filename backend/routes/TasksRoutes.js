const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTasksByStatus,
} = require('../controllers/tasksController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

// Routes principales
router.route('/')
  .get(getTasks)           // GET /api/tasks - Obtenir toutes les tâches
  .post(createTask);       // POST /api/tasks - Créer une nouvelle tâche

// Routes par statut
router.get('/status/:status', getTasksByStatus); // GET /api/tasks/status/pending

// Routes spécifiques à une tâche
router.route('/:id')
  .get(getTaskById)        // GET /api/tasks/:id - Obtenir une tâche
  .put(updateTask)         // PUT /api/tasks/:id - Mettre à jour une tâche
  .delete(deleteTask);     // DELETE /api/tasks/:id - Supprimer une tâche

// Route pour basculer le statut
router.patch('/:id/toggle', toggleTaskStatus); // PATCH /api/tasks/:id/toggle

module.exports = router;