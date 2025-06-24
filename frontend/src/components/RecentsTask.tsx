import React from "react";
import { Edit, Delete, CheckCircle, ReplayCircleFilled } from "@mui/icons-material";
import { Task } from "../types/Task"; // 💡 Assure-toi que le chemin est correct
import { NavLink } from "react-router-dom";
import "./RecentsTask.css";
import TaskIcon from "@mui/icons-material/Task";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: Task["status"]) => void;
}

const RecentsTask: React.FC<Props> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="recents-task">
      <div className="recents-task-header">
        <h2>Tâches récentes</h2>
        <NavLink to="/tasks" className="task-btn">
          <TaskIcon className="btn-icon" fontSize="medium" />
          Voir toutes les tâches
        </NavLink>{" "}
      </div>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Échéance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.slice(0, 7).map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
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
                <button title="Modifier la tâche" onClick={() => onEdit(task)}>
                  <Edit fontSize="medium" />
                </button>
                <button title="Supprimer la tâche" onClick={() => onDelete(task._id!)}>
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
                  {task.status === 'Terminée' ? (
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
  );
};

export default RecentsTask;
