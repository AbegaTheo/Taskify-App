import React from 'react';
import { Task } from '../types/Task';
import './Styles/TaskList.css';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string, newStatus: Task["status"]) => void;
}

const TaskList: React.FC<Props> = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  // ✅ Fonction pour obtenir l'icône de priorité
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Haute': return '🔴';
      case 'Moyenne': return '🟡';
      case 'Faible': return '🟢';
      default: return '⚪';
    }
  };

  // ✅ Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminée': return '✅';
      case 'En Cours': return '🔄';
      default: return '⏸️';
    }
  };

  // ✅ Fonction pour formater la date
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

  // ✅ Fonction pour obtenir la classe CSS selon la date d'échéance
  const getDateClass = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'normal';
  };

  // ✅ Fonction pour basculer le statut
  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === 'Terminée' ? 'En Cours' : 'Terminée';
    if (task._id) {
      onToggleStatus(task._id, newStatus);
    }
  };
  // ✅ Fonction pour confirmer la suppression
  const handleDelete = (task: Task) => {
    if (task._id && window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      onDelete(task._id);
    }
  };
  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Aucune tâche trouvée</h3>
          <p>Commencez par créer votre première tâche !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>📋 Liste complète de vos tâches</h2>
        <span className="task-count">{tasks.length} tâche{tasks.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div 
            key={task._id} 
            className={`task-card ${task.status === 'Terminée' ? 'completed' : ''} ${getDateClass(task.dueDate)}`}
          >
            {/* ✅ En-tête de la tâche */}
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {getPriorityIcon(task.priority)} {task.priority}
                  </span>
                  <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                    {getStatusIcon(task.status)} {task.status}
                  </span>
                </div>
              </div>
              
              <div className="task-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEdit(task)}
                  title="Modifier la tâche"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(task)}
                  title="Supprimer la tâche"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* ✅ Description */}
            {task.description && (
              <div className="task-description">
                <p>{task.description}</p>
              </div>
            )}

            {/* ✅ Informations de la tâche */}
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

              {/* ✅ Dates de création et modification */}
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

            {/* ✅ Actions rapides */}
            <div className="task-quick-actions">
              <button 
                className={`quick-action-btn toggle-status-btn ${task.status === 'Terminée' ? 'mark-pending' : 'mark-complete'}`}
                onClick={() => handleToggleStatus(task)}
              >
                {task.status === 'Terminée' ? '🔄 Marquer en cours' : '✅ Marquer terminée'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
