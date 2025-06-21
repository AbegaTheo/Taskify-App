import React, { useEffect, useState, useCallback } from 'react';
import './Dashboard.css';
import TaskStats from '../components/TaskStats';
import RecentsTask from '../components/RecentsTask';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Task } from '../types/Task';

// 🔧 Détection de l'environnement pour l'API
const isProduction = window.location.hostname.includes("render.com");
const API_URL = isProduction
  ? "https://taskify-backend-6dkg.onrender.com/api"
  : "http://localhost:5000/api";

const Dashboard: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Configuration axios avec token
  const getAxiosConfig = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }), [token]);

  // ✅ Fonction pour récupérer les tâches (useCallback pour éviter les re-renders)
  const fetchTasks = useCallback(async () => {
    if (!token || !isAuthenticated) {
      console.log("❌ Pas de token ou utilisateur non authentifié");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Chargement des tâches...");
      
      const response = await axios.get(`${API_URL}/tasks`, getAxiosConfig());
      
      console.log("✅ Tâches récupérées:", response.data);
      
      const tasksData = Array.isArray(response.data) ? response.data : [];
      setTasks(tasksData);
      setFilteredTasks(tasksData);
      
    } catch (err: any) {
      console.error("❌ Erreur lors du chargement des tâches:", err);
      
      if (err.response?.status === 404) {
        setError("Route des tâches non trouvée. Vérifiez votre serveur.");
      } else if (err.response?.status === 401) {
        setError("Non autorisé. Veuillez vous reconnecter.");
      } else {
        setError(err.response?.data?.message || "Erreur lors du chargement des tâches");
      }
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, getAxiosConfig]);

  // ✅ Fonction pour filtrer les tâches (useCallback)
  const fetchFilteredTasks = useCallback(async (filters: any) => {
    if (!token || !isAuthenticated) return;

    try {
      console.log("🔄 Filtrage des tâches...", filters);
      
      const response = await axios.get(`${API_URL}/tasks/filter`, {
        ...getAxiosConfig(),
        params: filters
      });
      
      console.log("✅ Tâches filtrées:", response.data);
      setFilteredTasks(response.data);
      
    } catch (err: any) {
      console.error("❌ Erreur lors du filtrage:", err);
      // En cas d'erreur, utiliser le filtrage local
      applyLocalFilters();
    }
  }, [token, isAuthenticated, getAxiosConfig]);

  // ✅ Filtrage local en fallback
  const applyLocalFilters = useCallback(() => {
    let filtered = [...tasks];
    
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    if (selectedDate) {
      filtered = filtered.filter(task => task.dueDate.startsWith(selectedDate));
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, selectedDate]);

  // ✅ Charger les tâches au montage du composant
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    }
  }, [isAuthenticated, token, fetchTasks]);

  // ✅ Appliquer les filtres
  useEffect(() => {
    if (tasks.length === 0) return;

    // Si on a des filtres actifs, essayer le filtrage serveur
    if (searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || selectedDate) {
      const filters = {
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(selectedDate && { dueDate: selectedDate })
      };
      
      fetchFilteredTasks(filters);
    } else {
      // Pas de filtres, afficher toutes les tâches
      setFilteredTasks(tasks);
    }
  }, [tasks, searchTerm, statusFilter, priorityFilter, selectedDate, fetchFilteredTasks]);

  // ✅ Ajouter une nouvelle tâche
  const handleAddTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      console.log("🔄 Création d'une nouvelle tâche...", taskData);
      
      const response = await axios.post(
        `${API_URL}/tasks`,
        taskData,
        getAxiosConfig()
      );
      
      const newTask = response.data;
      setTasks(prev => [...prev, newTask]);
      console.log("✅ Nouvelle tâche créée:", newTask);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la création:", error);
      setError(error.response?.data?.message || "Erreur lors de la création de la tâche");
    }
  };

  // ✅ Modifier une tâche
  const handleEditTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      console.log("🔄 Modification de la tâche...", { taskId, updatedData });
      
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        updatedData,
        getAxiosConfig()
      );
      
      const updatedTask = response.data;
      setTasks(prev => prev.map(task => task._id === taskId ? updatedTask : task));
      console.log("✅ Tâche modifiée:", updatedTask);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la modification:", error);
      setError(error.response?.data?.message || "Erreur lors de la modification de la tâche");
    }
  };

  // ✅ Supprimer une tâche
  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log("🔄 Suppression de la tâche...", taskId);
      
      await axios.delete(`${API_URL}/tasks/${taskId}`, getAxiosConfig());
      
      setTasks(prev => prev.filter(task => task._id !== taskId));
      console.log("✅ Tâche supprimée:", taskId);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la suppression:", error);
      setError(error.response?.data?.message || "Erreur lors de la suppression de la tâche");
    }
  };

  // ✅ Changer le statut d'une tâche
  const handleToggleStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      console.log("🔄 Changement de statut...", { taskId, newStatus });
      
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { status: newStatus },
        getAxiosConfig()
      );
      
      const updatedTask = response.data;
      setTasks(prev => prev.map(task =>
        task._id === taskId ? updatedTask : task
      ));
      
      console.log("✅ Statut mis à jour:", updatedTask);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour du statut:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  // ✅ Gestion du formulaire de tâche
  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // ✅ Gestion de la création/modification de tâche depuis le formulaire
  const handleTaskFormSubmit = (taskData: Task | Omit<Task, '_id'>) => {
    if ('_id' in taskData && taskData._id) {
      // Modification d'une tâche existante
      handleEditTask(taskData._id, taskData);
    } else {
      // Création d'une nouvelle tâche
      handleAddTask(taskData as Omit<Task, '_id'>);
    }
    closeTaskForm();
  };

  // ✅ Affichage conditionnel si pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="auth-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour accéder au dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
    {/* ✅ Section de bienvenue avec bouton aligné */}
    <div className="welcome-section">
      <div className="welcome-content">
        <h1 className="welcome-title">
          Bienvenue, {user?.username || user?.email?.split('@')[0] || 'Utilisateur'} ! 👋
        </h1>
        <p className="date-subtitle">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
      
      {/* ✅ Bouton Ajouter une tâche déplacé ici */}
      <button 
        className="add-task-btn"
        onClick={() => setShowTaskForm(true)}
      >
        ➕ Ajouter une tâche
      </button>
    </div>

      {/* ✅ Gestion des états */}
      {loading && (
        <div className="loading-section">
          <p>🔄 Chargement de vos tâches...</p>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p className="error-message">❌ {error}</p>
          <button onClick={() => {
            setError(null);
            fetchTasks();
          }} className="retry-btn">
            🔄 Réessayer
          </button>
        </div>
      )}

      {/* ✅ Contenu principal */}
      {!loading && (
        <>
          <TaskStats tasks={tasks} />
          
          <TaskFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <RecentsTask
            tasks={filteredTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}

      {/* ✅ Formulaire de tâche - CORRECTION du problème TypeScript */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={closeTaskForm}
          onTaskCreated={(newTask) => {
            handleAddTask(newTask);
            closeTaskForm();
          }}
          onTaskUpdated={(updatedTask) => {
            // ✅ CORRECTION : Vérifier que _id existe avant de l'utiliser
            if (updatedTask._id) {
              handleEditTask(updatedTask._id, updatedTask);
              closeTaskForm();
            } else {
              console.error("❌ Erreur: _id manquant dans la tâche mise à jour");
            }
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
