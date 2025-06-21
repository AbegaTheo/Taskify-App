import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Task } from '../types/Task';
import './Styles/TaskStats.css';

interface Props {
  tasks: Task[];
}

const TaskStats: React.FC<Props> = ({ tasks }) => {
  const completed = tasks.filter(task => task.status === 'Terminée').length;
  const inProgress = tasks.filter(task => task.status === 'En Cours').length;
  const total = tasks.length;
  const highPriority = tasks.filter(task => task.priority === 'Haute').length;

  return (
    <div className="task-stats">
      <div className="stat-box">
        <CheckCircleIcon className="icon green" />
        <p>Tâches accomplies</p>
        <h3 className='completed'>{completed}</h3>
      </div>
      <div className="stat-box">
        <HourglassBottomIcon className="icon blue" />
        <p>Tâches en cours</p>
        <h3 className='inProgress'>{inProgress}</h3>
      </div>
      <div className="stat-box">
        <FormatListBulletedIcon className="icon purple" />
        <p>Total des tâches</p>
        <h3 className='total'>{total}</h3>
      </div>
      <div className="stat-box">
        <ReportProblemIcon className="icon red" />
        <p>Priorité haute</p>
        <h3 className='priority'>{highPriority}</h3>
      </div>
    </div>
  );
};

export default TaskStats;
