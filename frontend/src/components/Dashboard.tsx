import { useState, useEffect } from 'react';
import api from '../api';

interface Props { onLogout: () => void; userEmail: string; }
interface Project { id: number; name: string; description: string; created_at: string; }
interface Task { id: number; project_id?: number; title: string; status: string; due_date?: string; }
interface Stats { totalProjects: number; totalTasks: number; completedTasks: number; pendingTasks: number; }

export default function Dashboard({ onLogout, userEmail }: Props) {
  const [view, setView] = useState<'dashboard'|'projects'|'tasks'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [pName, setPName] = useState(''); const [pDesc, setPDesc] = useState('');
  const [tTitle, setTTitle] = useState(''); const [tStatus, setTStatus] = useState('todo'); const [tDue, setTDue] = useState(''); const [tProject, setTProject] = useState('');
  const [msg, setMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [_loading, setLoading] = useState(true);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const loadData = async () => {
    try {
      setLoading(true);
      const [rStats, rProj, rTasks] = await Promise.all([api.get('/dashboard'), api.get('/projects'), api.get('/tasks')]);
      setStats(rStats.data); setProjects(rProj.data); setAllTasks(rTasks.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const todoTasks = allTasks.filter(t => t.status === 'todo' && (!searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())));
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress' && (!searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())));
  const doneTasks = allTasks.filter(t => t.status === 'done' && (!searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())));

  const getProjectProgress = (projectId: number) => {
    const pTasks = allTasks.filter(t => t.project_id === projectId);
    if (pTasks.length === 0) return 0;
    return Math.round((pTasks.filter(t => t.status === 'done').length / pTasks.length) * 100);
  };
  const getProjectTaskCount = (projectId: number) => allTasks.filter(t => t.project_id === projectId).length;
  const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const saveProject = async () => {
    try {
      if (editProject) { await api.put(`/projects/${editProject.id}`, { name: pName, description: pDesc }); flash('✓ Project updated'); }
      else { await api.post('/projects', { name: pName, description: pDesc }); flash('✓ Project created'); }
      setPName(''); setPDesc(''); setShowProjectForm(false); setEditProject(null); loadData();
    } catch (e: any) { flash(e.response?.data?.message || 'Error'); }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); flash('✓ Project deleted'); loadData(); } catch {}
  };

  const saveTask = async () => {
    try {
      if (editTask) { await api.put(`/tasks/${editTask.id}`, { title: tTitle, status: tStatus, dueDate: tDue || undefined }); flash('✓ Task updated'); }
      else { await api.post('/tasks', { projectId: parseInt(tProject), title: tTitle, status: tStatus, dueDate: tDue || undefined }); flash('✓ Task created'); }
      setTTitle(''); setTStatus('todo'); setTDue(''); setTProject(''); setShowTaskForm(false); setEditTask(null); loadData();
    } catch (e: any) { flash(e.response?.data?.message || 'Error'); }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); flash('✓ Task deleted'); loadData(); } catch {}
  };

  const startEditProject = (p: Project) => { setEditProject(p); setPName(p.name); setPDesc(p.description); setShowProjectForm(true); };
  const startEditTask = (t: Task) => { setEditTask(t); setTTitle(t.title); setTStatus(t.status); setTDue(t.due_date || ''); setTProject(String(t.project_id || '')); setShowTaskForm(true); };

  const renderTaskCard = (t: Task) => (
    <div key={t.id} className="task-card">
      <strong>{t.title}</strong>
      <p>📁 {projects.find(p => p.id === t.project_id)?.name || 'Unassigned'}</p>
      {t.due_date && <small>📅 Due: {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>}
      <div className="card-actions">
        <button onClick={() => startEditTask(t)}>Edit</button>
        <button className="danger" onClick={() => deleteTask(t.id)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">📋 ProjectHub</div>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => { setView('dashboard'); setSearchQuery(''); }}>📊 Dashboard</button>
          <button className={view === 'projects' ? 'active' : ''} onClick={() => { setView('projects'); setSearchQuery(''); }}>📁 Projects</button>
          <button className={view === 'tasks' ? 'active' : ''} onClick={() => { setView('tasks'); setSearchQuery(''); }}>✅ Tasks Board</button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">👤 {userEmail}</div>
          <button className="logout-btn" onClick={onLogout}>↩ Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        {msg && <div className="flash-msg">{msg}</div>}

        {/* ────── DASHBOARD ────── */}
        {view === 'dashboard' && (
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's an overview of your workspace.</p>

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">📁</div>
                <div className="stat-num">{stats.totalProjects}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">📋</div>
                <div className="stat-num">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-num">{stats.pendingTasks}</div>
                <div className="stat-label">Pending Tasks</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">✅</div>
                <div className="stat-num">{stats.completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            {/* Overall Progress */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Overall Progress</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{overallProgress}%</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, height: '8px' }}></div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-grid">
              <div className="recent-section">
                <h2>📁 Recent Projects</h2>
                {projects.length === 0 ? <div className="empty"><span className="empty-icon">📁</span>No projects yet</div> :
                  projects.slice(0, 5).map(p => (
                    <div key={p.id} className="recent-item">
                      <div>
                        <strong>{p.name}</strong>
                        <p>{p.description?.substring(0, 50) || 'No description'}</p>
                      </div>
                      <span className="badge in-progress">{getProjectProgress(p.id)}%</span>
                    </div>
                  ))}
              </div>
              <div className="recent-section">
                <h2>📋 Recent Tasks</h2>
                {allTasks.length === 0 ? <div className="empty"><span className="empty-icon">📋</span>No tasks yet</div> :
                  allTasks.slice(0, 5).map(t => (
                    <div key={t.id} className="recent-item">
                      <div>
                        <strong>{t.title}</strong>
                        <p>📁 {projects.find(p => p.id === t.project_id)?.name || 'Unassigned'}</p>
                      </div>
                      <span className={`badge ${t.status}`}>{t.status}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ────── PROJECTS ────── */}
        {view === 'projects' && (
          <div>
            <div className="page-header">
              <div>
                <h1>Projects</h1>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>{projects.length} project{projects.length !== 1 ? 's' : ''} in workspace</p>
              </div>
              <button className="btn-primary" onClick={() => { setShowProjectForm(true); setEditProject(null); setPName(''); setPDesc(''); }}>+ New Project</button>
            </div>

            <div className="filter-bar">
              <input type="text" className="search-input" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {showProjectForm && (
              <div className="form-card">
                <h3>{editProject ? '✏️ Edit Project' : '📁 New Project'}</h3>
                <input placeholder="Project name" value={pName} onChange={e => setPName(e.target.value)} />
                <textarea placeholder="Description (optional)" value={pDesc} onChange={e => setPDesc(e.target.value)} />
                <div className="form-actions">
                  <button className="btn-primary" onClick={saveProject}>Save Project</button>
                  <button className="btn-ghost" onClick={() => { setShowProjectForm(false); setEditProject(null); }}>Cancel</button>
                </div>
              </div>
            )}

            {filteredProjects.length === 0 ? (
              <div className="empty"><span className="empty-icon">📁</span><br/>No projects found. Create your first project!</div>
            ) : (
              <div className="project-list">
                {filteredProjects.map(p => {
                  const progress = getProjectProgress(p.id);
                  const taskCount = getProjectTaskCount(p.id);
                  return (
                    <div key={p.id} className="project-card">
                      <div className="card-actions">
                        <button onClick={() => startEditProject(p)}>Edit</button>
                        <button className="danger" onClick={() => deleteProject(p.id)}>Del</button>
                      </div>
                      <strong>{p.name}</strong>
                      <p>{p.description || 'No description'}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span className="badge in-progress">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                        <span className="badge done">{progress}% done</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <small>Created {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ────── TASKS KANBAN ────── */}
        {view === 'tasks' && (
          <div>
            <div className="page-header">
              <div>
                <h1>Task Board</h1>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>{allTasks.length} task{allTasks.length !== 1 ? 's' : ''} across all projects</p>
              </div>
              <button className="btn-primary" onClick={() => { setShowTaskForm(true); setEditTask(null); setTTitle(''); setTStatus('todo'); setTDue(''); setTProject(''); }}>+ New Task</button>
            </div>

            <div className="filter-bar">
              <input type="text" className="search-input" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {showTaskForm && (
              <div className="form-card">
                <h3>{editTask ? '✏️ Edit Task' : '📋 New Task'}</h3>
                <input placeholder="Task title" value={tTitle} onChange={e => setTTitle(e.target.value)} />
                <select value={tProject} onChange={e => setTProject(e.target.value)}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={tStatus} onChange={e => setTStatus(e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <input type="date" value={tDue} onChange={e => setTDue(e.target.value)} />
                <div className="form-actions">
                  <button className="btn-primary" onClick={saveTask}>Save Task</button>
                  <button className="btn-ghost" onClick={() => { setShowTaskForm(false); setEditTask(null); }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="kanban-board">
              <div className="kanban-column todo">
                <div className="kanban-header">
                  <h3>⏳ To Do</h3>
                  <span className="col-count">{todoTasks.length}</span>
                </div>
                <div className="kanban-body">
                  {todoTasks.length === 0 ? <div className="empty" style={{ padding: '24px', border: 'none', background: 'transparent' }}>No tasks</div> : todoTasks.map(renderTaskCard)}
                </div>
              </div>
              <div className="kanban-column in-progress">
                <div className="kanban-header">
                  <h3>🔄 In Progress</h3>
                  <span className="col-count">{inProgressTasks.length}</span>
                </div>
                <div className="kanban-body">
                  {inProgressTasks.length === 0 ? <div className="empty" style={{ padding: '24px', border: 'none', background: 'transparent' }}>No tasks</div> : inProgressTasks.map(renderTaskCard)}
                </div>
              </div>
              <div className="kanban-column done">
                <div className="kanban-header">
                  <h3>✅ Done</h3>
                  <span className="col-count">{doneTasks.length}</span>
                </div>
                <div className="kanban-body">
                  {doneTasks.length === 0 ? <div className="empty" style={{ padding: '24px', border: 'none', background: 'transparent' }}>No tasks</div> : doneTasks.map(renderTaskCard)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
