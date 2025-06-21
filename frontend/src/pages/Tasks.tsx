import React, { useEffect, useState, useCallback } from 'react';
import './Tasks.css';
import TaskStats from '../components/TaskStats';
import TaskList from '../components/TaskList';
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

const Tasks: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
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
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ✅ Configuration axios avec token
  const getAxiosConfig = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }), [token]);

  //* ✅ Fonction pour récupérer les tâches
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

  //* ✅ Fonction pour filtrer et trier les tâches
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...tasks];
    
    // Filtrage
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

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'Haute': 3, 'Moyenne': 2, 'Faible': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, selectedDate, sortBy, sortOrder]);

  // ✅ Charger les tâches au montage du composant
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    }
  }, [isAuthenticated, token, fetchTasks]);

  // ✅ Appliquer les filtres et le tri
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  //* ✅ Ajouter une nouvelle tâche
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

  //* ✅ Modifier une tâche
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

  //* ✅ Supprimer une tâche
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

  //* ✅ Changer le statut d'une tâche
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

  // ✅ Affichage conditionnel si pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="tasks-container">
        <div className="auth-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour accéder à vos tâches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      {/* ✅ Section de bienvenue avec bouton aligné */}
      <div className="tasks-header">
        <div className="header-content">
          <h1 className="page-title">
            Mes Tâches
          </h1>
          <p className="page-description">
            Gérer vos tâches en toute sécurité avec Taskify.
          </p>
        </div>
        
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

          {/* ✅ Options de tri */}
          <div className="sort-controls">
            <div className="sort-group">
              <label htmlFor="sortBy">Trier par :</label>
              <select 
                id="sortBy"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="dueDate">📅 Date d'échéance</option>
                <option value="priority">🔥 Priorité</option>
                <option value="title">📝 Titre</option>
                <option value="createdAt">🕒 Date de création</option>
              </select>
            </div>
            
            <button 
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '⬆️ Croissant' : '⬇️ Décroissant'}
            </button>
          </div>
          
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}

      {/* ✅ Formulaire de tâche */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={closeTaskForm}
          onTaskCreated={(newTask) => {
            handleAddTask(newTask);
            closeTaskForm();
          }}
          onTaskUpdated={(updatedTask) => {
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
export default Tasks;
