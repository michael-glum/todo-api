import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasksController';
import { body, query, param } from 'express-validator';

const router = Router();

const taskBodyValidationRules = [
  body('taskDescription').isString().notEmpty().withMessage('Task description is required.'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date.'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean.'),
];

const taskIdValidation = [
  param('id').isUUID().withMessage('Invalid task ID format.')
];

const taskQueryValidationRules = [
  query('completed').optional().isBoolean().withMessage('Completed must be true or false.'),
  query('sort_by').optional().matches(/^(\+|\-)(dueDate|createdDate)$/)
    .withMessage('Sort_by must be either +dueDate, -dueDate, +createdDate, or -createdDate.')
];

router.get('/', taskQueryValidationRules, getAllTasks);
router.get('/:id', taskIdValidation, getTaskById);
router.post('/', taskBodyValidationRules, createTask);
router.put('/:id', taskIdValidation.concat(taskBodyValidationRules), updateTask);
router.delete('/:id', taskIdValidation, deleteTask);

export default router;