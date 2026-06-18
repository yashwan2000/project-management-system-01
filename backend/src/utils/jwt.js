// jwt.js – JWT helper functions
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a signed JWT for a given user ID.
 * Payload includes `sub` (subject) as the user ID.
 * Expiration is taken from JWT_EXPIRES env var or defaults to 1h.
 */
export const signToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES || '1h';
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a token and return the decoded payload.
 * Throws if verification fails.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
