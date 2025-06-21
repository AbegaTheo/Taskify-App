export interface Task {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Faible" | "Moyenne" | "Haute";
  status: "En Cours" | "Terminée";
  completed?: boolean;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: string;
}
