import Tasks from "../models/Tasks.js";

// @desc    Obtenir toutes les tâches de l'utilisateur avec filtres
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order } = req.query;
    
    // Construction du filtre
    let filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    // Construction du tri
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Par défaut, tri par date de création décroissante
    }

    const tasks = await Tasks.find(filter).sort(sortOptions);
    
    // Statistiques des tâches
    const totalTasks = await Tasks.countDocuments({ user: req.user._id });
    const completedTasks = await Tasks.countDocuments({ user: req.user._id, status: 'Terminée' });
    const pendingTasks = await Tasks.countDocuments({ user: req.user._id, status: 'En Cours' });

    res.json({
      tasks,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des tâches',
      error: error.message
    });
  }
};

// @desc    Obtenir une tâche spécifique
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à accéder à cette tâche' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la tâche',
      error: error.message
    });
  }
};

// @desc    Créer une nouvelle tâche
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    // Validation des champs requis
    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    if (!dueDate) {
      return res.status(400).json({ message: "La date d'échéance est requise" });
    }

    // Vérifier que la date d'échéance n'est pas dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);
    
    if (taskDueDate < today) {
      return res.status(400).json({ 
        message: 'La date d\'échéance ne peut pas être dans le passé' 
      });
    }

    const task = await Tasks.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Moyenne',
      dueDate,
      status: status || 'En Cours',
      user: req.user._id,
    });

    res.status(201).json({
      message: 'Tâche créée avec succès',
      task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la création de la tâche',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une tâche
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette tâche' });
    }

    // Validation de la date d'échéance si elle est modifiée
    if (req.body.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newDueDate = new Date(req.body.dueDate);
      
      if (newDueDate < today) {
        return res.status(400).json({ 
          message: 'La date d\'échéance ne peut pas être dans le passé' 
        });
      }
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        title: req.body.title ? req.body.title.trim() : task.title,
        description: req.body.description !== undefined ? req.body.description.trim() : task.description
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Tâche mise à jour avec succès',
      task: updatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la tâche',
      error: error.message
    });
  }
};

// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette tâche' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la tâche',
      error: error.message
    });
  }
};

// @desc    Marquer une tâche comme terminée/non terminée
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Basculer le statut
    let newStatus;
    if (task.status === 'Terminée') {
      newStatus = 'En Cours';
    } else {
      newStatus = 'Terminée';
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    res.json({
      message: `Tâche marquée comme ${
        newStatus === "Terminée" ? "Terminée" : "En Cours"
      }`,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors du changement de statut',
      error: error.message
    });
  }
};

// @desc    Obtenir les tâches par statut
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['En Cours', 'Terminée'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const tasks = await Tasks.find({ 
      user: req.user._id, 
      status 
    }).sort({ createdAt: -1 });

    res.json({
      status,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des tâches',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTasksByStatus,
};