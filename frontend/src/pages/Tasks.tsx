import React, { useEffect, useState, useCallback } from "react";
import "./Tasks.css";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Task } from "../types/Task";
import { toast } from "react-toastify";

// 🔧 Détection de l'environnement pour l'API
const isProduction = window.location.hostname.includes("render.com");
const API_URL = isProduction
  ? "https://taskify-backend-6dkg.onrender.com/api"
  : "http://localhost:5000/api";

const Tasks: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "dueDate" | "priority" | "createdAt" | "title"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getAxiosConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
    [token]
  );

  const fetchTasks = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/tasks`, getAxiosConfig());
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (err.response?.status === 404
            ? "Route des tâches non trouvée."
            : err.response?.status === 401
            ? "Non autorisé. Veuillez vous reconnecter."
            : "Erreur lors du chargement des tâches")
      );
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, getAxiosConfig]);

  useEffect(() => {
    if (isAuthenticated && token) fetchTasks();
  }, [isAuthenticated, token, fetchTasks]);

  //* ✅ Fonction pour Ajouter une tâche
  const handleAddTask = async (taskData: Omit<Task, "_id">) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        taskData,
        getAxiosConfig()
      );
      setTasks((prev) => [...prev, response.data]);
      toast.success("Tâche ajoutée avec succès");
      fetchTasks();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création de la tâche"
      );
      toast.error("Erreur lors de la création de la tâche");
    }
  };

  //* ✅ Fonction pour Modifier une tâche
  const handleEditTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        updatedData,
        getAxiosConfig()
      );
      const updatedTask = response.data;
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
      toast.success("Tâche modifiée avec succès");
      // Délai avant d'appliquer le filtre
      setTimeout(() => {
        setStatusFilter("all");
      }, 3000); // 3 secondes d'affichage du toast
      fetchTasks();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la modification de la tâche"
      );
      toast.error("Erreur lors de la modification de la tâche");
    }
  };

  //* ✅ Fonction pour Supprimer une tâche
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, getAxiosConfig());
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Tâche supprimée avec succès");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression de la tâche"
      );
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  //* ✅ Fonction pour Changer le statut d'une tâche
  const handleToggleStatus = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { status: newStatus },
        getAxiosConfig()
      );
      const updatedTask = response.data;
      console.log("Tâche mise à jour : ", updatedTask);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      // Message toast
      toast.success(
        `Tâche marquée comme ${
          newStatus === "Terminée" ? "Terminée" : "En Cours"
        }`
      );

      // Délai avant d'appliquer le filtre
      setTimeout(() => {
        setStatusFilter("all");
      }, 3000); // 3 secondes d'affichage du toast
      fetchTasks();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du statut"
      );
      toast.error("Une erreur est survenue 😢");
    }
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

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
      <div className="tasks-header">
        <div className="header-content">
          <h1 className="page-title">Mes Tâches</h1>
          <p className="page-description">
            Gérer vos tâches en toute sécurité avec Taskify.
          </p>
        </div>
        <button className="add-task-btn" onClick={() => setShowTaskForm(true)}>
          ➕ Ajouter une tâche
        </button>
      </div>

      {loading && (
        <div className="loading-section">
          <p>🔄 Chargement de vos tâches...</p>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p className="error-message">❌ {error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchTasks();
            }}
            className="retry-btn"
          >
            🔄 Réessayer
          </button>
        </div>
      )}

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
          <div className="sort-controls">
            <div className="sort-group">
              <label htmlFor="sortBy">Trier par :</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="createdAt">🕒 Date de création</option>
                <option value="priority">🔥 Priorité</option>
                <option value="title">📝 Titre</option>
                <option value="dueDate">📅 Date d'échéance</option>
              </select>
            </div>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "⬆️ Croissant" : "⬇️ Décroissant"}
            </button>
          </div>

          <TaskList
            tasks={tasks}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            selectedDate={selectedDate}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}

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
              console.error(
                "❌ Erreur: _id manquant dans la tâche mise à jour"
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default Tasks;
