// User.js – simple model helpers for MySQL

import pool from '../config/db.js';

export const createUser = async (email, passwordHash) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return { id: result.insertId, email };
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};
