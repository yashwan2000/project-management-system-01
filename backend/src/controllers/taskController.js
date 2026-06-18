// taskController.js – minimal stub implementations for demo purposes

export const create = async (req, res, next) => {
  try {
    // In a real app you would insert into DB; here we echo back
    const { projectId, title, status, dueDate } = req.body;
    const task = { id: Date.now(), projectId, title, status: status || 'todo', dueDate };
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    // Return empty array or dummy tasks
    res.json([]);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Dummy task
    res.json({ id, title: 'Demo task', status: 'todo' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    // In real app, update DB; here just acknowledge
    res.json({ message: `Task ${id} updated` });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    // In real app, delete from DB; here just acknowledge
    res.json({ message: `Task ${id} deleted` });
  } catch (err) {
    next(err);
  }
};
