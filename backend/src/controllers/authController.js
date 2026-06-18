// authController.js - handles registration and login
import { createUser, findUserByEmail } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await hashPassword(password);
    const user = await createUser(email, hashed);
    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};
