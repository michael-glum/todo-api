import { Request, Response } from 'express';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

let tasks: Task[] = [];

const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return true;
  }
  return false;
};

export const getAllTasks = (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  let result = tasks;

  // Filter by completed status
  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === 'true';
    result = result.filter((task) => task.completed === isCompleted);
  }

  // Sorting logic
  if (req.query.sort_by) {
    const sortBy = req.query.sort_by as string;
    let order = '+';
    let field = sortBy;

    if (sortBy.startsWith('+') || sortBy.startsWith('-')) {
      order = sortBy[0];
      field = sortBy.slice(1);
    }

    result.sort((a, b) => {
      const valueA = a[field as keyof Task];
      const valueB = b[field as keyof Task];

      if (valueA instanceof Date && valueB instanceof Date) {
        return order === '+' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
      }

      return 0;
    });
  }

  res.status(200).json(result);
};

export const getTaskById = (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const task = tasks.find((t) => t.id === req.params.id);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

export const createTask = (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const { taskDescription, dueDate, completed = false } = req.body;

  const newTask: Task = {
    id: uuidv4(),
    taskDescription,
    createdDate: new Date(),
    dueDate: new Date(dueDate),
    completed: Boolean(completed),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    const { taskDescription, dueDate, completed } = req.body;
    tasks[index] = {
      ...tasks[index],
      taskDescription,
      dueDate: new Date(dueDate),
      completed,
    };

    res.status(200).json(tasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

export const deleteTask = (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(200).send();
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};