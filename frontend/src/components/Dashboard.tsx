import { useState, useEffect } from 'react';
import api from '../api';

interface Props { onLogout: () => void; userEmail: string; }

interface Project { id: number; name: string; description: string; created_at: string; }
interface Task { id: number; project_id?: number; title: string; status: string; due_date?: string; }
interface Stats { totalProjects: number; totalTasks: number; completedTasks: number; pendingTasks: number; }

export default function Dashboard({ onLogout, userEmail }: Props) {
  const [view, setView] = useState<'dashboard'|'projects'|'tasks'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [pName, setPName] = useState(''); const [pDesc, setPDesc] = useState('');
  const [tTitle, setTTitle] = useState(''); const [tStatus, setTStatus] = useState('todo'); const [tDue, setTDue] = useState(''); const [tProject, setTProject] = useState('');
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const loadStats = async () => {
    try { const r = await api.get('/dashboard'); setStats(r.data); } catch {}
  };
  const loadProjects = async () => {
    try { const r = await api.get('/projects'); setProjects(r.data); } catch {}
  };
  const loadTasks = async () => {
    try {
      const url = selectedProject ? `/tasks?projectId=${selectedProject}` : '/tasks';
      const r = await api.get(url);
      setTasks(r.data);
    } catch {}
  };

  useEffect(() => { loadStats(); loadProjects(); }, []);
  useEffect(() => { if (view === 'tasks') loadTasks(); }, [view, selectedProject]);

  const saveProject = async () => {
    try {
      if (editProject) { await api.put(`/projects/${editProject.id}`, { name: pName, description: pDesc }); flash('Project updated!'); }
      else { await api.post('/projects', { name: pName, description: pDesc }); flash('Project created!'); }
      setPName(''); setPDesc(''); setShowProjectForm(false); setEditProject(null);
      loadProjects(); loadStats();
    } catch (e: any) { flash(e.response?.data?.message || 'Error'); }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Delete project?')) return;
    try { await api.delete(`/projects/${id}`); flash('Project deleted'); loadProjects(); loadStats(); } catch {}
  };

  const startEditProject = (p: Project) => {
    setEditProject(p); setPName(p.name); setPDesc(p.description); setShowProjectForm(true);
  };

  const saveTask = async () => {
    try {
      if (editTask) { await api.put(`/tasks/${editTask.id}`, { title: tTitle, status: tStatus, dueDate: tDue || undefined }); flash('Task updated!'); }
      else { await api.post('/tasks', { projectId: parseInt(tProject), title: tTitle, status: tStatus, dueDate: tDue || undefined }); flash('Task created!'); }
      setTTitle(''); setTStatus('todo'); setTDue(''); setTProject(''); setShowTaskForm(false); setEditTask(null);
      loadTasks(); loadStats();
    } catch (e: any) { flash(e.response?.data?.message || 'Error'); }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Delete task?')) return;
    try { await api.delete(`/tasks/${id}`); flash('Task deleted'); loadTasks(); loadStats(); } catch {}
  };

  const startEditTask = (t: Task) => {
    setEditTask(t); setTTitle(t.title); setTStatus(t.status); setTDue(t.due_date || ''); setTProject(String(t.project_id || '')); setShowTaskForm(true);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">📋 ProjectHub</div>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>📊 Dashboard</button>
          <button className={view === 'projects' ? 'active' : ''} onClick={() => setView('projects')}>📁 Projects</button>
          <button className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>✅ Tasks</button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">{userEmail}</div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        {msg && <div className="flash-msg">{msg}</div>}

        {view === 'dashboard' && (
          <div>
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card blue"><div className="stat-num">{stats.totalProjects}</div><div className="stat-label">Total Projects</div></div>
              <div className="stat-card green"><div className="stat-num">{stats.totalTasks}</div><div className="stat-label">Total Tasks</div></div>
              <div className="stat-card orange"><div className="stat-num">{stats.pendingTasks}</div><div className="stat-label">Pending Tasks</div></div>
              <div className="stat-card purple"><div className="stat-num">{stats.completedTasks}</div><div className="stat-label">Completed</div></div>
            </div>
            <div className="recent-section">
              <h2>Recent Projects</h2>
              {projects.length === 0 ? <p className="empty">No projects yet. Create one!</p> : (
                <div className="project-list">
                  {projects.slice(0, 5).map(p => (
                    <div key={p.id} className="project-card">
                      <strong>{p.name}</strong>
                      <p>{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'projects' && (
          <div>
            <div className="page-header">
              <h1>Projects</h1>
              <button className="btn-primary" onClick={() => { setShowProjectForm(true); setEditProject(null); setPName(''); setPDesc(''); }}>+ New Project</button>
            </div>
            {showProjectForm && (
              <div className="form-card">
                <h3>{editProject ? 'Edit Project' : 'New Project'}</h3>
                <input placeholder="Project name *" value={pName} onChange={e => setPName(e.target.value)} />
                <textarea placeholder="Description" value={pDesc} onChange={e => setPDesc(e.target.value)} />
                <div className="form-actions">
                  <button className="btn-primary" onClick={saveProject}>Save</button>
                  <button className="btn-ghost" onClick={() => { setShowProjectForm(false); setEditProject(null); }}>Cancel</button>
                </div>
              </div>
            )}
            {projects.length === 0 ? <p className="empty">No projects yet.</p> : (
              <div className="project-list">
                {projects.map(p => (
                  <div key={p.id} className="project-card">
                    <div>
                      <strong>{p.name}</strong>
                      <p>{p.description}</p>
                      <small>Created: {new Date(p.created_at).toLocaleDateString()}</small>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => startEditProject(p)}>Edit</button>
                      <button className="danger" onClick={() => deleteProject(p.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'tasks' && (
          <div>
            <div className="page-header">
              <h1>Tasks</h1>
              <button className="btn-primary" onClick={() => { setShowTaskForm(true); setEditTask(null); setTTitle(''); setTStatus('todo'); setTDue(''); setTProject(''); }}>+ New Task</button>
            </div>
            <div className="filter-bar">
              <select value={selectedProject || ''} onChange={e => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}>
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {showTaskForm && (
              <div className="form-card">
                <h3>{editTask ? 'Edit Task' : 'New Task'}</h3>
                <input placeholder="Task title *" value={tTitle} onChange={e => setTTitle(e.target.value)} />
                <select value={tProject} onChange={e => setTProject(e.target.value)}>
                  <option value="">Select Project *</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={tStatus} onChange={e => setTStatus(e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <input type="date" value={tDue} onChange={e => setTDue(e.target.value)} />
                <div className="form-actions">
                  <button className="btn-primary" onClick={saveTask}>Save</button>
                  <button className="btn-ghost" onClick={() => { setShowTaskForm(false); setEditTask(null); }}>Cancel</button>
                </div>
              </div>
            )}
            {tasks.length === 0 ? <p className="empty">No tasks yet.</p> : (
              <div className="task-list">
                {tasks.map(t => (
                  <div key={t.id} className={`task-card status-${t.status}`}>
                    <div>
                      <strong>{t.title}</strong>
                      <span className={`badge ${t.status}`}>{t.status}</span>
                      {t.due_date && <small>Due: {new Date(t.due_date).toLocaleDateString()}</small>}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => startEditTask(t)}>Edit</button>
                      <button className="danger" onClick={() => deleteTask(t.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
