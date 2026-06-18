// projects.js - project routes
import { Router } from 'express';
import {
  create,
  list,
  getOne,
  update,
  remove,
} from '../controllers/projectController.js';
import { validate } from '../middlewares/validation.js';
import { body, param } from 'express-validator';

const router = Router();

router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('Name required'),
    body('description').optional(),
  ]),
  create
);

router.get('/', list);
router.get('/:id', getOne);
router.put(
  '/:id',
  validate([
    body('name').optional(),
    body('description').optional(),
  ]),
  update
);
router.delete('/:id', remove);

export default router;
