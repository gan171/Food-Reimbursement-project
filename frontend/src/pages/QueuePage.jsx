import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getErrorMessage } from '../utils';

export const QueuePage = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setError('');
    api
      .get('/claims/queue')
      .then((res) => setRows(res.data))
      .catch((err) => {
        setRows([]);
        setError(getErrorMessage(err, 'Unable to load queue.'));
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (id, actionType) => {
    let comment = '';
    let approvedAmount;
    let utrReference;

    if (actionType === 'REJECT' || actionType === 'ASK_CLARIFICATION') {
      comment = prompt('Comment is required for this action:') || '';
      if (!comment.trim()) return;
    }

    if (actionType === 'APPROVE') {
      approvedAmount = prompt('Approved amount (optional, especially for accounts stage):') || undefined;
      utrReference = prompt('UTR / payment reference (optional):') || undefined;
    }

    setBusyId(id);
    try {
      await api.post(`/claims/${id}/action`, { action: actionType, comment, approvedAmount, utrReference });
      load();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update claim.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="card">
      <h2>Approval Queue</h2>
      <p className="muted">Review pending claims in your stage queue.</p>
      {error && <p className="error">{error}</p>}
      {!rows.length ? <p className="muted">No pending claims in your queue.</p> : null}
      {rows.map((claim) => (
        <div key={claim.id} className="list-row">
          <div>
            <strong>{claim.claim_id}</strong>
            <p className="muted">{claim.employee_name} · {claim.department} · ₹{claim.amount_claimed}</p>
          </div>
          <div className="actions">
            <button disabled={busyId === claim.id} onClick={() => handleAction(claim.id, 'APPROVE')}>Approve</button>
            <button className="warn" disabled={busyId === claim.id} onClick={() => handleAction(claim.id, 'ASK_CLARIFICATION')}>Ask Clarification</button>
            <button className="danger" disabled={busyId === claim.id} onClick={() => handleAction(claim.id, 'REJECT')}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
