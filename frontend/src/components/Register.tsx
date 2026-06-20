import { useState, type FormEvent } from 'react';
import api from '../api';

interface Props { onSuccess: (token: string, email: string) => void; onSwitch: () => void; }

export default function Register({ onSuccess, onSwitch }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password });
      onSuccess(res.data.token, res.data.user.email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <p className="subtitle">Join ProjectHub today</p>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      </form>
      <p className="switch-link">Already have an account? <span onClick={onSwitch}>Sign In</span></p>
    </div>
  );
}
