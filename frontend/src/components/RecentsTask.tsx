import React from "react";
import {
  Edit,
  Delete,
  RestartAlt,
  CheckCircle,
  ReplayCircleFilled,
} from "@mui/icons-material";
import { Task } from "../types/Task";
import { NavLink } from "react-router-dom";
import "./RecentsTask.css";
import TaskIcon from "@mui/icons-material/Task";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: Task["status"]) => void;
  onResetFilters: () => void;
}

const RecentsTask: React.FC<Props> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetFilters,
}) => {
  return (
    <div className="recents-task">
      <div className="recents-task-header">
        <div className="recents-task-title">
          <h2>Tâches récentes</h2>
          <h3>Visualisez vos 10 dernières tâches</h3>
        </div>
        <div className="recents-task-buttons">
          <button className="task-btn" onClick={onResetFilters}>
          <RestartAlt className="btn-icon" fontSize="medium" />
          Réinitialiser les filtres
        </button>
        <NavLink to="/tasks" className="task-btn">
          <TaskIcon className="btn-icon" fontSize="medium" />
          Toutes les tâches
        </NavLink>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Aucune tâche trouvée</h3>
          <p>Commencez par créer une nouvelle tâche !</p>
          <button className="reset-btn" onClick={onResetFilters}>
            <RestartAlt className="btn-icon" fontSize="medium" />
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="task-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 10).map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <span className={`status ${task.status}`}>{task.status}</span>
                </td>
                <td>
                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </td>
                <td>{new Date(task.dueDate).toLocaleDateString("fr-FR")}</td>
                <td className="actions">
                  <button
                    title="Modifier la tâche"
                    onClick={() => onEdit(task)}
                  >
                    <Edit fontSize="medium" />
                  </button>
                  <button
                    title="Supprimer la tâche"
                    onClick={() => onDelete(task._id!)}
                  >
                    <Delete fontSize="medium" />
                  </button>
                  <button
                    title={
                      task.status === "En Cours"
                        ? "Terminer la tâche"
                        : "Reprendre la tâche"
                    }
                    onClick={() =>
                      onToggleStatus(
                        task._id!,
                        task.status === "En Cours" ? "Terminée" : "En Cours"
                      )
                    }
                  >
                    {task.status === "Terminée" ? (
                      <ReplayCircleFilled fontSize="medium" />
                    ) : (
                      <CheckCircle fontSize="medium" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default RecentsTask;
