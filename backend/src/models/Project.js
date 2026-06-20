import { db } from './memoryDb.js';

export const createProject = async (userId, name, description) => {
  const project = { id: Date.now(), user_id: userId, name, description, created_at: new Date().toISOString() };
  db.projects.push(project);
  return project;
};

export const getProjectsByUser = async (userId) => {
  return db.projects.filter(p => p.user_id === userId);
};

export const getProjectById = async (projectId, userId) => {
  return db.projects.find(p => p.id === Number(projectId) && p.user_id === userId);
};

export const updateProject = async (projectId, userId, data) => {
  const p = db.projects.find(p => p.id === Number(projectId) && p.user_id === userId);
  if (!p) return 0;
  if (data.name) p.name = data.name;
  if (data.description) p.description = data.description;
  return 1;
};

export const deleteProject = async (projectId, userId) => {
  const initialLen = db.projects.length;
  db.projects = db.projects.filter(p => !(p.id === Number(projectId) && p.user_id === userId));
  return initialLen - db.projects.length;
};
