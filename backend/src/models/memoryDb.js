import { hashPassword } from '../utils/hash.js';

export const db = {
  users: [],
  projects: [],
  tasks: []
};

// Seed admin user
(async () => {
  db.users.push({
    id: 1,
    email: 'admin@gmail.com',
    password: await hashPassword('admin@enter')
  });
})();
