export interface Task {
  id: string;
  taskDescription: string;
  createdDate: Date;
  dueDate: Date;
  completed: boolean;
}