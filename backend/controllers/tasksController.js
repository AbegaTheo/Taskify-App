import Tasks from '../models/Tasks.js';

// ✅ Récupérer toutes les tâches de l'utilisateur
export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.user._id, isArchived: false }).sort({ createdAt: -1 });
    console.log("✅ Tâches récupérées");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Erreur récupération:", error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
  }
};

// ✅ Créer une nouvelle tâche
export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Le titre est requis' });
  }

  try {
    const task = new Tasks({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
      status,
    });

    const createdTask = await task.save();
    console.log("✅ Tâche créée");
    res
      .status(201)
      .json({ message: "Tâche créée avec succès", task: createdTask });
  } catch (error) {
    console.error("❌ Erreur création:", error.message);
    res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
  }
};

// ✅ Récupérer une tâche spécifique
export const getSingleTask = async (req, res) => {
  try {
    const task = await Tasks.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    console.log("✅ Tâche trouvée");
    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Erreur getSingleTask:", error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération de la tâche' });
  }
};

// ✅ Modifier une tâche
export const updateTask = async (req, res) => {
  const { title, description, completed, dueDate, priority, status } = req.body;

  try {
    const task = await Tasks.findById(req.params.id);

    // Vérifie si la tâche existe
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Vérifie si le titre est valide
/*     if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Titre invalide" });
    } */

    // Vérifie si l'utilisateur est le propriétaire de la tâche
    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Accès refusé. Action non autorisée" });
    }

    // Mise à jour des champs uniquement si les valeurs sont définies
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (completed !== undefined) {
      task.completed = completed;
      // Marque la date de complétion si terminée
      task.completedAt = completed ? new Date() : null;
    }

    const updatedTask = await task.save();
    console.log("✅ Tâche mise à jour");
    res
      .status(200)
      .json({ message: "Tâche mise à jour avec succès", updatedTask });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la tâche :", error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};

// ✅ Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    await task.deleteOne();
    console.log("✅ Tâche supprimée");
    res.json({ message: 'Tâche supprimée avec succès 🗑️' });
  } catch (error) {
    console.error("❌ Erreur suppression:", error.message);
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
  }
};

// ✅ Archiver une tâche
export const archiveTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    task.isArchived = true;
    const archivedTask = await task.save();
    console.log("✅ Tâche archivée");
    res.json({ message: 'Tâche archivée avec succès', task: archivedTask });
  } catch (error) {
    console.error("❌ Erreur archiveTask:", error.message);
    res.status(500).json({ message: 'Erreur lors de l\'archivage de la tâche' });
  }
};

// ✅ Restaurer une tâche archivée
export const restoreTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    task.isArchived = false;
    const restoredTask = await task.save();
    console.log("✅ Tâche restaurée");
    res.json({ message: 'Tâche restaurée avec succès', task: restoredTask });
  } catch (error) {
    console.error("❌ Erreur restoreTask:", error.message);
    res.status(500).json({ message: 'Erreur lors de la restauration de la tâche' });
  }
};

// ✅ Filtrage des tâches
export const filterTasks = async (req, res) => {
  const { priority, status } = req.query;

  try {
    let filter = { user: req.user._id, isArchived: false };

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Tasks.find(filter).sort({ createdAt: -1 });
    console.log("✅ Tâches filtrées");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Erreur filterTasks:", error.message);
    res.status(500).json({ message: 'Erreur lors du filtrage des tâches' });
  }
};
