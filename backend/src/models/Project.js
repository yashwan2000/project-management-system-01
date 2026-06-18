// Project.js – DB helpers for projects
import pool from '../config/db.js';

// Create a new project for a user
export const createProject = async (userId, name, description) => {
  const [result] = await pool.execute(
    'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?)',
    [userId, name, description]
  );
  return { id: result.insertId, userId, name, description };
};

// Get all projects belonging to a user
export const getProjectsByUser = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT id, name, description, created_at, updated_at FROM projects WHERE user_id = ?',
    [userId]
  );
  return rows;
};

// Get a single project by its ID, ensuring it belongs to the user
export const getProjectById = async (projectId, userId) => {
  const [rows] = await pool.execute(
    'SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ? AND user_id = ?',
    [projectId, userId]
  );
  return rows[0];
};

// Update a project (only name/description)
export const updateProject = async (projectId, userId, data) => {
  const fields = [];
  const values = [];
  if (data.name) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (fields.length === 0) return 0;
  values.push(projectId, userId);
  const [result] = await pool.execute(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows;
};

// Delete a project (cascades to tasks via FK)
export const deleteProject = async (projectId, userId) => {
  const [result] = await pool.execute(
    'DELETE FROM projects WHERE id = ? AND user_id = ?',
    [projectId, userId]
  );
  return result.affectedRows;
};
