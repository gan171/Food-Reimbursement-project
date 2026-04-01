import { useEffect, useState } from 'react';
import { api } from '../api/client';

export const QueuePage = () => {
  const [rows, setRows] = useState([]);

  const load = () => api.get('/claims/queue').then((res) => setRows(res.data)).catch(() => setRows([]));

  useEffect(() => {
    load();
  }, []);

  const action = async (id, actionType) => {
    const comment = actionType === 'REJECT' ? prompt('Reason (required)') : prompt('Comment (optional)');
    await api.post(`/claims/${id}/action`, { action: actionType, comment });
    load();
  };

  return (
    <div className="card">
      <h2>Approval Queue</h2>
      {rows.map((claim) => (
        <div key={claim.id} className="list-row">
          <div>
            <strong>{claim.claim_id}</strong> · {claim.employee_name} · ₹{claim.amount_claimed}
          </div>
          <div>
            <button onClick={() => action(claim.id, 'APPROVE')}>Approve</button>
            <button className="danger" onClick={() => action(claim.id, 'REJECT')}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
