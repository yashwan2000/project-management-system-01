import { db } from '../models/memoryDb.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProjects = db.projects.filter(p => p.user_id === userId);
    const projectIds = userProjects.map(p => p.id);
    const userTasks = db.tasks.filter(t => projectIds.includes(t.project_id));
    
    const completedTasks = userTasks.filter(t => t.status === 'done').length;
    const pendingTasks = userTasks.filter(t => t.status !== 'done').length;
    
    const projectsInProgress = new Set(userTasks.filter(t => t.status !== 'done').map(t => t.project_id)).size;

    res.json({
      totalProjects: userProjects.length,
      totalTasks: userTasks.length,
      completedTasks,
      pendingTasks,
      projectsInProgress,
    });
  } catch (err) {
    next(err);
  }
};
