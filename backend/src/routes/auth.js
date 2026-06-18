// auth.js - authentication routes
import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validate } from '../middlewares/validation.js';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail(),
    body('password').exists(),
  ]),
  login
);

export default router;
