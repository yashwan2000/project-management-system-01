import { db } from './memoryDb.js';

export const createUser = async (email, passwordHash) => {
  const user = { id: Date.now(), email, password: passwordHash };
  db.users.push(user);
  return { id: user.id, email };
};

export const findUserByEmail = async (email) => {
  return db.users.find(u => u.email === email);
};

export const findUserById = async (id) => {
  return db.users.find(u => u.id === id);
};
