import { useState } from 'react';
import { api } from '../api/client';

export const SubmitClaimPage = () => {
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ otDate: '', timeIn: '', timeOut: '', amountClaimed: '', purpose: '', bill: null });

  const submit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => v && payload.append(k, v));
    const { data } = await api.post('/claims', payload);
    setMsg(`Claim submitted successfully: ${data.claimId}`);
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Submit Overtime Meal Claim</h2>
      <input type="date" onChange={(e) => setForm({ ...form, otDate: e.target.value })} required />
      <div className="row">
        <input type="time" onChange={(e) => setForm({ ...form, timeIn: e.target.value })} required />
        <input type="time" onChange={(e) => setForm({ ...form, timeOut: e.target.value })} required />
      </div>
      <input type="number" placeholder="Amount" onChange={(e) => setForm({ ...form, amountClaimed: e.target.value })} required />
      <textarea placeholder="Purpose" onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
      <input type="file" accept="image/*,.pdf" onChange={(e) => setForm({ ...form, bill: e.target.files[0] })} required />
      <button type="submit">Submit</button>
      {msg && <p>{msg}</p>}
    </form>
  );
};
