// projectController.js - handles project CRUD
import {
  createProject,
  getProjectsByUser,
  getProjectById,
  updateProject,
  deleteProject,
} from '../models/Project.js';

export const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await createProject(req.user.id, name, description);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const projects = await getProjectsByUser(req.user.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id, req.user.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const affected = await updateProject(req.params.id, req.user.id, req.body);
    if (!affected) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const affected = await deleteProject(req.params.id, req.user.id);
    if (!affected) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
