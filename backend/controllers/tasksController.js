import Tasks from '../models/Tasks.js';

// @desc    Récupérer les tâches de l'utilisateur connecté
export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ user: req.user._id, isArchived: false }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
    console.log("Tâches trouvées avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
  }
};

// @desc    Créer une nouvelle tâche
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
    res.status(201).json(createdTask);
    console.log("Tâche créée avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
  }
};

// @desc    Récupérer une tâche spécifique
export const getSingleTask = async (req, res, next) => {
  try {
    const task = await Tasks.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    res.status(200).json(task);
    console.log("Tâche trouvée avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la tâche' });
  }
  next();
};

// @desc    Mettre à jour une tâche
export const updateTask = async (req, res) => {
  const { title, description, completed, dueDate, priority, status } = req.body;

  try {
    const task = await Tasks.findByIdAndUpdate(req.params.id);
    // Vérifier si la tâche existe
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    // Vérifier si l'utilisateur est autorisé à mettre à jour la tâche
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed ?? task.completed;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
    console.log("Tâche mise à jour avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// @desc    Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Action non autorisée' });
    }

    await task.remove();
    res.json({ message: 'Tâche supprimée avec succès 🗑️' });
    console.log("Tâche supprimée avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
  }
};

// @desc    Archiver une tâche
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
    res.json(archivedTask);
    console.log("Tâche archivée avec succès");
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'archivage de la tâche' });
  }
};

// @desc    Restaurer une tâche archivée
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
      res.json(restoredTask);
      console.log("Tâche restaurée avec succès");
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du restauration de la tâche' });
    }
};

// @desc    Filtrage (par priorité ou statut)
export const filterTasks = async (req, res) => {
  const { priority, status } = req.query;

  try {
    const tasks = await Tasks.find({ user: req.user._id }.sort({ createdAt: -1 }));

    if (priority) {
      const filteredTasks = tasks.filter((task) => task.priority === priority);
      res.status(200).json(filteredTasks);
    } else if (status) {
      const filteredTasks = tasks.filter((task) => task.status === status);
      res.status(200).json(filteredTasks);
    } else {
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du filtrage des tâches' });
  }
};