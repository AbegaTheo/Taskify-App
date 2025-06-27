import React, { useMemo } from 'react';
import { Task } from '../types/Task';
import './TaskList.css';
import { Edit, Delete, CheckCircle, ReplayCircleFilled } from "@mui/icons-material";

interface Props {
  tasks: Task[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  selectedDate: string;
  sortBy: "dueDate" | "priority" | "createdAt" | "title";
  sortOrder: "asc" | "desc";
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: Task["status"]) => void;
}

const TaskList: React.FC<Props> = ({
  tasks,
  searchTerm,
  statusFilter,
  priorityFilter,
  selectedDate,
  sortBy,
  sortOrder,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getPriorityIcon = (priority: string = '') => {
    switch (priority) {
      case 'Haute': return '🔴';
      case 'Moyenne': return '🟡';
      case 'Faible': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status: string = '') => {
    switch (status) {
      case 'Terminée': return '✅';
      case 'En Cours': return '🔄';
      default: return '⏸️';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `⚠️ En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return '🔥 Aujourd\'hui';
    } else if (diffDays === 1) {
      return '⏰ Demain';
    } else {
      return `📅 Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };

  const getDateClass = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 3) return "soon";
    return "normal";
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (selectedDate) {
      filtered = filtered.filter(task =>
        task.dueDate.startsWith(selectedDate)
      );
    }

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "priority":
          const priorityMap = { Haute: 3, Moyenne: 2, Faible: 1 };
          aValue = priorityMap[a.priority as keyof typeof priorityMap];
          bValue = priorityMap[b.priority as keyof typeof priorityMap];
          break;
        case "dueDate":
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, searchTerm, statusFilter, priorityFilter, selectedDate, sortBy, sortOrder]);

  const handleToggleStatus = (task: Task) => {
    const status = task.status === 'Terminée' ? 'En Cours' : 'Terminée';
    if (task._id) {
      onToggleStatus(task._id, status);
    }
  };

  const handleDelete = (task: Task) => {
    if (task._id && window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      onDelete(task._id);
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="vide-state">
          <div className="vide-icon">📝</div>
          <h3>Aucune tâche trouvée</h3>
          <p>Commencez par créer une nouvelle tâche !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>📋 Liste complète de vos tâches</h2>
        <span className="task-count">{filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={`${task._id}-${task.updatedAt}`}
            className={`task-card ${task.status === 'Terminée' ? 'completed' : ''} ${getDateClass(task.dueDate)}`}
          >
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title"><span className='title'>Titre :</span> {task.title}</h3>
                <div className="task-meta">
                  <span className={`priority-badge priority-${task.priority?.toLowerCase() || 'non-defini'}`}>
                    {getPriorityIcon(task.priority)} {task.priority}
                  </span>
                  <span className={`status-badge status-${task.status?.toLowerCase().replace(' ', '-') || 'inconnu'}`}>
                    {getStatusIcon(task.status)} {task.status}
                  </span>
                </div>
              </div>

              <div className="task-actions">
                <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Modifier la tâche">
                  <Edit fontSize="medium" />
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(task)} title="Supprimer la tâche">
                  <Delete fontSize="medium" />
                </button>
                <button
                  className={`action-btn toggle-status-btn ${task.status === 'Terminée' ? 'mark-pending' : 'mark-complete'}`}
                  onClick={() => handleToggleStatus(task)}
                  title={task.status === 'Terminée' ? 'Remettre en cours' : 'Marquer comme terminée'}
                >
                  {task.status === 'Terminée' ? (
                    <ReplayCircleFilled fontSize="medium" />
                  ) : (
                    <CheckCircle fontSize="medium" />
                  )}
                </button>
              </div>
            </div>

            {task.description && (
              <div className="task-description">
                <p>{task.description}</p>
              </div>
            )}

            <div className="task-info">
              <div className={`due-date ${getDateClass(task.dueDate)}`}>
                <span className="due-date-text">{formatDate(task.dueDate)}</span>
                <span className="due-date-full">
                  {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="task-timestamps">
                {task.createdAt && (
                  <span className="timestamp">
                    📅 Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <span className="timestamp">
                    ✏️ Modifiée le {new Date(task.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {task.completedAt && (
                  <span className="timestamp completed-timestamp">
                    ✅ Terminée le {new Date(task.completedAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
