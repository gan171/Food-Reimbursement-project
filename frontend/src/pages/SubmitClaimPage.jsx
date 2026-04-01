import { useState } from 'react';
import { api } from '../api/client';
import { getErrorMessage } from '../utils';

const initial = { otDate: '', timeIn: '', timeOut: '', amountClaimed: '', purpose: '', bill: null };

export const SubmitClaimPage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(initial);

  const submit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setBusy(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => v && payload.append(k, v));
      const { data } = await api.post('/claims', payload);
      setSuccess(`${data.message} Claim ID: ${data.claimId}`);
      setForm(initial);
      e.target.reset();
    } catch (err) {
      setError(getErrorMessage(err, 'Claim submission failed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Submit Overtime Meal Claim</h2>
      <p className="muted">Upload your bill and route it automatically through approvals.</p>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <input type="date" onChange={(e) => setForm({ ...form, otDate: e.target.value })} required />
      <div className="row">
        <input type="time" onChange={(e) => setForm({ ...form, timeIn: e.target.value })} required />
        <input type="time" onChange={(e) => setForm({ ...form, timeOut: e.target.value })} required />
      </div>
      <input type="number" min="1" placeholder="Amount claimed" onChange={(e) => setForm({ ...form, amountClaimed: e.target.value })} required />
      <textarea placeholder="Purpose / Description" onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
      <input type="file" accept="image/*,.pdf" onChange={(e) => setForm({ ...form, bill: e.target.files[0] })} required />
      <button type="submit" disabled={busy}>{busy ? 'Submitting...' : 'Submit Claim'}</button>
    </form>
  );
};
