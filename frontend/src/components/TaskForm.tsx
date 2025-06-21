import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import './Styles/TaskForm.css';

interface Props {
  task: Task | null;
  onClose: () => void;
  onTaskCreated: (newTask: Omit<Task, '_id'>) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskForm: React.FC<Props> = ({ task, onClose, onTaskCreated, onTaskUpdated }) => {
  const [formData, setFormData] = useState<Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Moyenne',
    status: 'En Cours',
  });

  // ✅ État pour l'animation
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ✅ Animation d'entrée
  useEffect(() => {
    // Déclencher l'animation d'entrée après le montage
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      onTaskUpdated({ ...task, ...formData });
    } else {
      onTaskCreated({
        ...formData,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        description: formData.description,
        title: formData.title,
      } as Omit<Task, '_id'>);
    }
    
    handleClose();
  };

  // ✅ Gestion de la fermeture avec animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Durée de l'animation de sortie
  };

  // ✅ Fermeture en cliquant sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ✅ Fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div 
      className={`task-form-modal ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form">
          {/* ✅ En-tête avec bouton de fermeture */}
          <div className="form-header">
            <h3>{task ? '✏️ Modifier' : '➕ Nouvelle'} tâche</h3>
            <button 
              type="button" 
              className="close-btn"
              onClick={handleClose}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* ✅ Champs du formulaire */}
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="title">📝 Titre *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Entrez le titre de la tâche..."
                value={formData.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">📄 Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez votre tâche..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">📅 Date d'échéance *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]} // Empêcher les dates passées
              />
            </div>

            {/* ✅ Ligne alignée pour Priorité et Statut */}
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="priority">🔥 Priorité</label>
                <select 
                  id="priority" 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                >
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Faible">Faible</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="status">📊 Statut</label>
                <select 
                  id="status" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="En Cours">En Cours</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
            </div>
          </div>

          {/* ✅ Actions du formulaire */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {task ? '💾 Enregistrer' : '➕ Ajouter'}
            </button>
            <button type="button" onClick={handleClose} className="cancel-btn">
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
