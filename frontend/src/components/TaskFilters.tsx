// src/components/TaskFilters.tsx
import React from 'react';
import './TaskFilters.css';
import SearchIcon from '@mui/icons-material/Search';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  selectedDate,
  onDateChange
}) => {
  return (
    <div className="task-filters-container">
      <h3 className="filters-title">Filtrer les tâches</h3>
      <div className="task-filters">
        <div className="filter-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="En Cours">En Cours</option>
            <option value="Terminée">Terminée</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority">Priorité</label>
          <select
            id="priority"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="all">Toutes les priorités</option>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Faible</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label htmlFor="search">Recherche</label>
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              id="search"
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
