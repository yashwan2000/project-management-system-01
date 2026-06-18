// Task.js – DB helpers for tasks
import pool from '../config/db.js';

export const createTask = async (projectId, title, status = 'todo', dueDate = null) => {
  const [result] = await pool.execute(
    'INSERT INTO tasks (project_id, title, status, due_date) VALUES (?, ?, ?, ?)',
    [projectId, title, status, dueDate]
  );
  return { id: result.insertId, projectId, title, status, dueDate };
};

export const getTasksByProject = async (projectId) => {
  const [rows] = await pool.execute(
    'SELECT id, title, status, priority, due_date, created_at, updated_at FROM tasks WHERE project_id = ?',
    [projectId]
  );
  return rows;
};

export const getTaskById = async (taskId) => {
  const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);
  return rows[0];
};

export const updateTask = async (taskId, data) => {
  const fields = [];
  const values = [];
  if (data.title) { fields.push('title = ?'); values.push(data.title); }
  if (data.status) { fields.push('status = ?'); values.push(data.status); }
  if (data.priority) { fields.push('priority = ?'); values.push(data.priority); }
  if (data.dueDate) { fields.push('due_date = ?'); values.push(data.dueDate); }
  if (fields.length === 0) return 0;
  values.push(taskId);
  const [result] = await pool.execute(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows;
};

export const deleteTask = async (taskId) => {
  const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
  return result.affectedRows;
};
