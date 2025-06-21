import Tasks from '../models/Tasks.js';

// ✅ Vérifie si la tâche appartient bien à l'utilisateur connecté
export const verifyTaskOwnership = async (req, res, next) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Tâche non trouvée'));
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Accès refusé : cette tâche ne vous appartient pas 🚫'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
