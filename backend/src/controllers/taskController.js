import * as TaskModel from '../models/Task.js';
import { db } from '../models/memoryDb.js';

export const create = async (req, res, next) => {
  try {
    const { projectId, title, status, dueDate } = req.body;
    const task = await TaskModel.createTask(projectId, title, status, dueDate);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let tasks = [];
    if (projectId) {
      tasks = await TaskModel.getTasksByProject(projectId);
    } else {
      const userProjects = db.projects.filter(p => p.user_id === req.user.id).map(p => p.id);
      tasks = db.tasks.filter(t => userProjects.includes(t.project_id));
    }
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const task = await TaskModel.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const affected = await TaskModel.updateTask(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const affected = await TaskModel.deleteTask(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
