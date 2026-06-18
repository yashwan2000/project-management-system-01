// tasks.js - task routes (basic stub)
import { Router } from 'express';
import {
  create,
  list,
  getOne,
  update,
  remove,
} from '../controllers/taskController.js';
import { validate } from '../middlewares/validation.js';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  validate([
    body('projectId').isInt().withMessage('projectId required'),
    body('title').notEmpty(),
    body('status').isIn(['todo', 'in-progress', 'done']).optional(),
    body('dueDate').optional().isISO8601(),
  ]),
  create
);

router.get('/', list);
router.get('/:id', getOne);
router.put(
  '/:id',
  validate([
    body('title').optional(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('dueDate').optional().isISO8601(),
  ]),
  update
);
router.delete('/:id', remove);

export default router;
