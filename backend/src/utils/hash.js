// hash.js – bcrypt helpers
import bcrypt from 'bcrypt';

export const hashPassword = async (plain) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plain, saltRounds);
  return hash;
};

export const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
