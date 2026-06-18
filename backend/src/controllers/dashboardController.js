// dashboardController.js – provides basic statistics for the logged‑in user
import pool from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id; // set by verifyToken middleware

    // total projects owned by the user
    const [[{ totalProjects }]] = await pool.execute(
      'SELECT COUNT(*) AS totalProjects FROM projects WHERE user_id = ?',
      [userId]
    );

    // total tasks under those projects
    const [[{ totalTasks }]] = await pool.execute(
      `SELECT COUNT(*) AS totalTasks
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
        WHERE p.user_id = ?`,
      [userId]
    );

    // completed tasks (status = 'done')
    const [[{ completedTasks }]] = await pool.execute(
      `SELECT COUNT(*) AS completedTasks
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
        WHERE p.user_id = ? AND t.status = 'done'`,
      [userId]
    );

    // pending tasks (todo or in‑progress)
    const [[{ pendingTasks }]] = await pool.execute(
      `SELECT COUNT(*) AS pendingTasks
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
        WHERE p.user_id = ? AND t.status IN ('todo','in-progress')`,
      [userId]
    );

    // projects that have at least one incomplete task
    const [[{ projectsInProgress }]] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) AS projectsInProgress
         FROM projects p
         JOIN tasks t ON t.project_id = p.id
        WHERE p.user_id = ? AND t.status <> 'done'`,
      [userId]
    );

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      projectsInProgress,
    });
  } catch (err) {
    next(err);
  }
};
