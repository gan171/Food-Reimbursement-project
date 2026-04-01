import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <div className="login-wrap">
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          await login(form.email, form.password);
        }}
      >
        <h1>Overtime Food Reimbursement</h1>
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
