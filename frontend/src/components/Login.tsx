import { useState, type FormEvent } from 'react';
import api from '../api';

interface Props { onSuccess: (token: string, email: string) => void; onSwitch: () => void; }

export default function Login({ onSuccess, onSwitch }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      onSuccess(res.data.token, res.data.user.email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      <p className="subtitle">Welcome back to ProjectHub</p>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="switch-link">Don't have an account? <span onClick={onSwitch}>Register</span></p>
    </div>
  );
}
