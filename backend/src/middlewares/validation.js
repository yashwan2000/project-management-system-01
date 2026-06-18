// validation.js – wrapper for express‑validator
import { validationResult } from 'express-validator';

export const validate = (checks) => async (req, res, next) => {
  await Promise.all(checks.map((check) => check.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
