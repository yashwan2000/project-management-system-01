import { db } from './memoryDb.js';

export const createTask = async (projectId, title, status = 'todo', dueDate = null) => {
  const task = { id: Date.now(), project_id: Number(projectId), title, status, due_date: dueDate };
  db.tasks.push(task);
  return task;
};

export const getTasksByProject = async (projectId) => {
  return db.tasks.filter(t => t.project_id === Number(projectId));
};

export const getTaskById = async (taskId) => {
  return db.tasks.find(t => t.id === Number(taskId));
};

export const updateTask = async (taskId, data) => {
  const t = db.tasks.find(t => t.id === Number(taskId));
  if (!t) return 0;
  if (data.title) t.title = data.title;
  if (data.status) t.status = data.status;
  if (data.dueDate) t.due_date = data.dueDate;
  return 1;
};

export const deleteTask = async (taskId) => {
  const initialLen = db.tasks.length;
  db.tasks = db.tasks.filter(t => t.id !== Number(taskId));
  return initialLen - db.tasks.length;
};
