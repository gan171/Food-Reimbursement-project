import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils';

export const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSubmit}>
        <p className="brand-kicker">Overtime Meal Claim Portal</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to submit and track food reimbursement claims.</p>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
};
